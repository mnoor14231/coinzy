import { NextRequest, NextResponse } from 'next/server';

// Arabic voices configuration for browser speech synthesis
const ARABIC_VOICES = {
  'Salma': 'ar-SA',     // Saudi Arabic
  'Ahmed': 'ar-EG',     // Egyptian Arabic  
  'Layla': 'ar-AE',     // UAE Arabic
  'Omar': 'ar-JO',      // Jordanian Arabic
  'Fatima': 'ar-LB',    // Lebanese Arabic
  'Hassan': 'ar-MA',    // Moroccan Arabic
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice, dialect = 'ar-SA', emotion = 'neutral' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // For now, we'll return a success response with the text and settings
    // This will allow the browser's speech synthesis to handle the TTS
    return new NextResponse(JSON.stringify({ 
      message: 'Arabic TTS ready - using browser speech synthesis',
      success: true,
      voice: voice || 'Ahmed',
      dialect: dialect,
      text: text,
      settings: {
        rate: emotion === 'excited' ? 1.2 : 1.0,
        pitch: emotion === 'happy' ? 1.1 : 1.0,
        volume: 0.9
      }
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Arabic TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 