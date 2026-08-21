import { NextResponse } from 'next/server';
import { MOCK_BANK_ACCOUNT } from '@/lib/bankingMockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    account: MOCK_BANK_ACCOUNT,
  });
}
