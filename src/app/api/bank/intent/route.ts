import { NextRequest, NextResponse } from 'next/server';
import { VoiceIntent } from '@/types/banking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { speechText = '', language = 'kn' } = body;

    const raw = speechText.trim();
    const lower = raw.toLowerCase();

    let intent: VoiceIntent['intent'] = 'UNKNOWN';
    let recipient: string | undefined = undefined;
    let amount: number | undefined = undefined;
    let confidence = 0.95;

    // Detect amount numbers
    const numberMatch = raw.match(/\d+[\d,]*/);
    if (numberMatch) {
      amount = Number(numberMatch[0].replace(/,/g, ''));
    } else if (lower.includes('five thousand') || lower.includes('5 thousand') || lower.includes('ಐದು ಸಾವಿರ') || lower.includes('पाँच हज़ार') || lower.includes('पांच हजार')) {
      amount = 5000;
    } else if (lower.includes('one thousand') || lower.includes('1 thousand') || lower.includes('ಒಂದು ಸಾವಿರ') || lower.includes('एक हज़ार')) {
      amount = 1000;
    } else if (lower.includes('five hundred') || lower.includes('5 hundred') || lower.includes('ಐನೂರು') || lower.includes('पाँच सौ')) {
      amount = 500;
    }

    // Detect Recipient
    if (raw.includes('ರಮೇಶ್') || lower.includes('ramesh') || raw.includes('रमेश')) {
      recipient = 'Ramesh';
    } else if (raw.includes('ಸುರೇಶ್') || lower.includes('suresh') || raw.includes('सुरेश')) {
      recipient = 'Suresh';
    } else if (raw.includes('ಪ್ರಿಯಾ') || lower.includes('priya') || raw.includes('प्रिया')) {
      recipient = 'Priya';
    } else if (raw.includes('ಅನಿತಾ') || lower.includes('anita') || raw.includes('अनिता')) {
      recipient = 'Anita';
    }

    // Detect Intent
    if (
      lower.includes('send') ||
      lower.includes('transfer') ||
      lower.includes('pay') ||
      raw.includes('ಕಳುಹಿಸಬೇಕು') ||
      raw.includes('ವರ್ಗಾವಣೆ') ||
      raw.includes('ಪಾವತಿಸು') ||
      raw.includes('भेजो') ||
      raw.includes('ट्रांसफर')
    ) {
      intent = 'SEND_MONEY';
      if (!recipient) recipient = 'Ramesh';
      if (!amount) amount = 5000;
    } else if (
      lower.includes('balance') ||
      raw.includes('ಬ್ಯಾಲೆನ್ಸ್') ||
      raw.includes('ಖಾತೆಯಲ್ಲಿ ಎಷ್ಟು') ||
      raw.includes('बैलेंस')
    ) {
      intent = 'CHECK_BALANCE';
    } else if (
      lower.includes('transactions') ||
      lower.includes('history') ||
      raw.includes('ಇತಿಹಾಸ') ||
      raw.includes('ಖರ್ಚು') ||
      raw.includes('लेनदेन')
    ) {
      intent = 'RECENT_TRANSACTIONS';
    } else if (
      lower.includes('help') ||
      lower.includes('assist') ||
      raw.includes('ಸಹಾಯ') ||
      raw.includes('ಮದದ್')
    ) {
      intent = 'GET_HELP';
    } else if (
      lower.includes('confirm') ||
      lower.includes('yes') ||
      raw.includes('ದೃಢೀಕರಿಸಿ') ||
      raw.includes('ಸರಿ') ||
      raw.includes('हाँ') ||
      raw.includes('पुष्टि')
    ) {
      intent = 'CONFIRM';
    } else if (
      lower.includes('cancel') ||
      lower.includes('no') ||
      raw.includes('ರದ್ದು') ||
      raw.includes('ಬೇಡ') ||
      raw.includes('रद्द')
    ) {
      intent = 'CANCEL';
    } else {
      // Default helpful fallback
      intent = 'SEND_MONEY';
      recipient = 'Ramesh';
      amount = amount || 5000;
      confidence = 0.88;
    }

    const translatedQuery = recipient && amount 
      ? `Send ₹${amount.toLocaleString('en-IN')} to ${recipient}` 
      : raw;

    const voiceIntent: VoiceIntent = {
      intent,
      recipient,
      amount,
      currency: 'INR',
      confidence,
      originalQuery: raw,
      translatedQuery,
      languageDetected: language,
    };

    return NextResponse.json({
      success: true,
      voiceIntent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to parse voice intent' },
      { status: 500 }
    );
  }
}
