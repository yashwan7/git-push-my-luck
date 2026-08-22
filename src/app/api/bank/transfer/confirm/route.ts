import { NextRequest, NextResponse } from 'next/server';
import { MOCK_BANK_ACCOUNT } from '@/lib/bankingMockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount = 5000, recipientName = 'Ramesh', recipientAccount = 'XXXXXX1234' } = body;

    const numAmount = Number(amount);
    const transactionId = 'ANUKOOL-DEMO-48291';
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newBalance = Math.max(0, MOCK_BANK_ACCOUNT.availableBalance - numAmount);

    return NextResponse.json({
      success: true,
      transactionId,
      status: 'completed',
      amount: numAmount,
      formattedAmount: `₹${numAmount.toLocaleString('en-IN')}`,
      recipientName,
      recipientAccount,
      senderAccount: MOCK_BANK_ACCOUNT.maskedAccountNumber,
      timestamp,
      remainingBalance: newBalance,
      message: 'Payment completed successfully via ANUKOOL Adaptive Payment Layer',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to complete transfer' },
      { status: 500 }
    );
  }
}
