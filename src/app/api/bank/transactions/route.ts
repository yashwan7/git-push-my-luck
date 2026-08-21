import { NextResponse } from 'next/server';
import { MOCK_TRANSACTIONS } from '@/lib/bankingMockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    transactions: MOCK_TRANSACTIONS,
  });
}
