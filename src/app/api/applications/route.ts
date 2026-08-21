import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ServiceApplicationModel } from '@/models/ServiceApplication';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'fallback',
        applications: [],
        message: 'MongoDB is offline'
      });
    }

    const applications = await ServiceApplicationModel.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, count: applications.length, applications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId,
      serviceTitle,
      category = 'government',
      applicantAnswers = {},
      adaptationModeUsed = 'cognitive',
      languageUsed = 'en',
    } = body;

    const confirmationCode = `NYN-${Date.now().toString().slice(-6)}`;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'fallback',
        confirmationCode,
        message: 'Application processed in offline mode (MongoDB is offline)'
      });
    }

    const newApp = await ServiceApplicationModel.create({
      serviceId,
      serviceTitle,
      category,
      applicantAnswers,
      confirmationCode,
      adaptationModeUsed,
      languageUsed,
      status: 'submitted',
    });

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      confirmationCode: newApp.confirmationCode,
      applicationId: newApp._id,
      message: 'Application saved to MongoDB successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
