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
      return NextResponse.json(
        { error: 'SARVAM_API_KEY is not configured', fallback: true },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const language = (formData.get('language') as string) || 'en';

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const targetLangCode = LANGUAGE_CODE_MAP[language] || 'en-IN';

    const sarvamFormData = new FormData();
    sarvamFormData.append('file', file, 'recording.wav');
    sarvamFormData.append('language_code', targetLangCode);
    sarvamFormData.append('model', 'saarika:v2');

    const sarvamRes = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: sarvamFormData,
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.warn('Sarvam STT error:', errText);
      return NextResponse.json(
        { error: 'Sarvam STT failed', details: errText, fallback: true },
        { status: sarvamRes.status }
      );
    }

    const data = await sarvamRes.json();
    return NextResponse.json({
      success: true,
      transcript: data.transcript || '',
      languageCode: data.language_code || targetLangCode,
    });
  } catch (error: any) {
    console.error('Sarvam STT route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error', fallback: true },
      { status: 500 }
    );
  }
}
