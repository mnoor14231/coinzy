import { NextRequest, NextResponse } from 'next/server';

// Lahajati.ai API configuration
const LAHAJATI_API_KEY = process.env.LAHAJATI_API_KEY;
const LAHAJATI_API_URL = 'https://api.lahajati.ai/v1/synthesize';

// Arabic dialects and voices from Lahajati
const LAHAJATI_VOICES = {
  'Salma': 'ar-sa-female-1',     // Saudi Female
  'Ahmed': 'ar-eg-male-1',       // Egyptian Male
  'Layla': 'ar-ae-female-1',     // UAE Female
  'Omar': 'ar-jo-male-1',        // Jordanian Male
  'Fatima': 'ar-lb-female-1',    // Lebanese Female
  'Hassan': 'ar-ma-male-1',      // Moroccan Male
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice, dialect = 'ar-SA', emotion = 'neutral' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // For development/demo purposes, return a mock response
    // In production, uncomment the real API call below
    
    // Mock response for development
    return NextResponse.json({ 
      message: 'Lahajati TTS not configured. Using browser fallback.',
      success: false 
    }, { status: 503 });

    /* 
    // Real Lahajati API call (uncomment when you have API key)
    if (!LAHAJATI_API_KEY) {
      return NextResponse.json({ 
        error: 'Lahajati API key not configured',
        success: false 
      }, { status: 503 });
    }

    const selectedVoice = LAHAJATI_VOICES[voice as keyof typeof LAHAJATI_VOICES] || LAHAJATI_VOICES.Ahmed;

    const response = await fetch(LAHAJATI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LAHAJATI_API_KEY}`,
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        voice: selectedVoice,
        dialect,
        emotion,
        speed: 1.0,
        pitch: 1.0,
        output_format: 'mp3',
        sample_rate: 44100,
        quality: 'high'
      }),
    });

    if (!response.ok) {
      throw new Error(`Lahajati API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
    */

  } catch (error) {
    console.error('Lahajati TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false 
    }, { status: 500 });
  }
} 