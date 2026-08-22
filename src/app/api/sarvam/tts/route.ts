import { NextRequest, NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

// Map supported language codes to Sarvam target_language_code
const LANGUAGE_CODE_MAP: Record<string, string> = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  en: 'en-IN',
};

// Verified natural regional speakers for Sarvam bulbul:v2
const SPEAKER_MAP: Record<string, string> = {
  hi: 'anushka',
  kn: 'vidya',
  ta: 'vidya',
  te: 'vidya',
  ml: 'vidya',
  mr: 'manisha',
  bn: 'arya',
  gu: 'anushka',
  en: 'anushka',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language = 'en', pace = 1.0 } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!SARVAM_API_KEY) {
      return NextResponse.json(
        { error: 'SARVAM_API_KEY is not configured', fallback: true },
        { status: 500 }
      );
    }

    const targetLangCode = LANGUAGE_CODE_MAP[language] || 'en-IN';
    const speaker = SPEAKER_MAP[language] || 'anushka';

    // Limit text chunk for optimal latency
    const truncatedText = text.slice(0, 500);

    const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [truncatedText],
        target_language_code: targetLangCode,
        speaker,
        pitch: 0,
        pace: Math.max(0.7, Math.min(pace, 1.4)),
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v2',
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.warn('Sarvam TTS API returned error:', errText);
      return NextResponse.json(
        { error: 'Sarvam TTS API failed', details: errText, fallback: true },
        { status: sarvamRes.status }
      );
    }

    const data = await sarvamRes.json();
    const base64Audio = data.audios?.[0];

    if (!base64Audio) {
      return NextResponse.json({ error: 'No audio returned', fallback: true }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      language: targetLangCode,
      speaker,
    });
  } catch (error: any) {
    console.error('Sarvam TTS route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error', fallback: true },
      { status: 500 }
    );
  }
}
