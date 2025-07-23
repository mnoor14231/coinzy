import { NextRequest, NextResponse } from 'next/server';

// English voices configuration for browser speech synthesis
const ENGLISH_VOICES = {
  'Haytham': 'en-US',   // US English
  'Sana': 'en-GB',      // British English
  'Layla': 'en-AU',     // Australian English
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id, model_id = 'browser-tts' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Return success response - the actual TTS will be handled by browser
    return NextResponse.json({ 
      message: 'English TTS ready - using browser speech synthesis',
      success: true,
      voice: voice_id || 'Haytham',
      text: text
    }, { status: 200 });

  } catch (error) {
    console.error('English TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false 
    }, { status: 500 });
  }
} 