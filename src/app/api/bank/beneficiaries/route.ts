import { NextResponse } from 'next/server';
import { MOCK_BENEFICIARIES } from '@/lib/bankingMockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    beneficiaries: MOCK_BENEFICIARIES,
  });
}
