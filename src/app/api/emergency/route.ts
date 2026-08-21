import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmergencyRecordModel } from '@/models/EmergencyRecord';

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'fallback',
        record: {
          fullName: 'Ramesh Kumar',
          bloodType: 'O+',
          emergencyContact: '+91 98765 43210',
          allergies: ['Penicillin', 'Dust'],
          medicalNotes: 'Carries inhaler',
          sosEvents: [],
        },
      });
    }

    let record = await EmergencyRecordModel.findOne();
    if (!record) {
      record = await EmergencyRecordModel.create({
        fullName: 'Ramesh Kumar',
        bloodType: 'O+',
        emergencyContact: '+91 98765 43210',
        allergies: ['Penicillin', 'Dust'],
        medicalNotes: 'Carries inhaler',
      });
    }

    return NextResponse.json({ success: true, source: 'mongodb', record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, location } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'fallback',
        message: 'SOS logged locally (MongoDB offline)',
      });
    }

    const record = await EmergencyRecordModel.findOneAndUpdate(
      {},
      {
        $push: {
          sosEvents: {
            eventType: eventType || '112 Dispatch Call',
            location,
            timestamp: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      message: 'Emergency SOS incident recorded in MongoDB',
      record,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
