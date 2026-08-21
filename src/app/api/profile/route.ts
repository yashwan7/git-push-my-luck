import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserProfileModel } from '@/models/UserProfile';
import { DEFAULT_ACCESSIBILITY_PROFILE } from '@/context/AccessibilityContext';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'memory_fallback',
        profile: DEFAULT_ACCESSIBILITY_PROFILE,
        message: 'Running without MongoDB connection (fallback mode active)'
      });
    }

    const userId = req.nextUrl.searchParams.get('userId') || 'anonymous_user';
    let doc = await UserProfileModel.findOne({ userId });

    if (!doc) {
      doc = await UserProfileModel.create({
        userId,
        profile: DEFAULT_ACCESSIBILITY_PROFILE,
      });
    }

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      profile: doc.profile,
      activePersonaName: doc.activePersonaName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, profile: DEFAULT_ACCESSIBILITY_PROFILE },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'anonymous_user', profile, activePersonaName } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'memory_fallback',
        message: 'Saved to client state (MongoDB is offline)'
      });
    }

    const updated = await UserProfileModel.findOneAndUpdate(
      { userId },
      { profile, activePersonaName, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      profile: updated.profile,
      activePersonaName: updated.activePersonaName,
      message: 'Profile saved to MongoDB successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
