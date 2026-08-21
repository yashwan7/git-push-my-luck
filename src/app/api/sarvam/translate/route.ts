import { NextRequest, NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

const LANGUAGE_CODE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  en: 'en-IN',
};

export async function POST(req: NextRequest) {
  try {
    if (!SARVAM_API_KEY) {
      return NextResponse.json({ error: 'SARVAM_API_KEY is not configured', fallback: true }, { status: 500 });
    }

    const body = await req.json();
    const { input, sourceLanguage = 'en', targetLanguage = 'hi' } = body;

    if (!input) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    const srcCode = LANGUAGE_CODE_MAP[sourceLanguage] || 'en-IN';
    const tgtCode = LANGUAGE_CODE_MAP[targetLanguage] || 'hi-IN';

    const sarvamRes = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input,
        source_language_code: srcCode,
        target_language_code: tgtCode,
        mode: 'formal',
        model: 'mayura:v1',
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      return NextResponse.json({ error: 'Sarvam translation failed', details: errText, fallback: true }, { status: sarvamRes.status });
    }

    const data = await sarvamRes.json();
    return NextResponse.json({
      success: true,
      translatedText: data.translated_text || input,
      sourceLanguage: srcCode,
      targetLanguage: tgtCode,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error', fallback: true }, { status: 500 });
  }
}
