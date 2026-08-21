import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AuditReportModel } from '@/models/AuditReport';
import { runAccessibilityAudit } from '@/lib/auditEngine';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const url = req.nextUrl.searchParams.get('url');

    if (!db) {
      if (url) {
        return NextResponse.json({
          success: true,
          source: 'local_engine',
          audit: runAccessibilityAudit(url),
        });
      }
      return NextResponse.json({ success: true, source: 'fallback', audits: [] });
    }

    if (url) {
      let audit = await AuditReportModel.findOne({ url });
      if (!audit) {
        const generated = runAccessibilityAudit(url);
        audit = await AuditReportModel.create({
          url,
          ...generated,
        });
      }
      return NextResponse.json({ success: true, source: 'mongodb', audit });
    }

    const audits = await AuditReportModel.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, audits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const auditData = runAccessibilityAudit(url);

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: 'local_engine',
        audit: auditData,
        message: 'Audit generated locally (MongoDB offline)'
      });
    }

    const saved = await AuditReportModel.create({
      url,
      ...auditData,
    });

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      audit: saved,
      message: 'Audit report saved to MongoDB successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
