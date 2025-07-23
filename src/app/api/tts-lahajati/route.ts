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

    // Return success response - the actual TTS will be handled by browser
    return NextResponse.json({ 
      message: 'Arabic TTS ready - using browser speech synthesis',
      success: true,
      voice: voice || 'Ahmed',
      dialect: dialect,
      text: text
    }, { status: 200 });

  } catch (error) {
    console.error('Arabic TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false 
    }, { status: 500 });
  }
} 