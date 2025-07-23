import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// ElevenLabs public voice IDs that support Arabic via Multilingual v2
const ARABIC_VOICES = {
  'Haytham': 'pNInz6obpgDQGcFmaJgB', // Adam - clear male voice
  'Sana': 'EXAVITQu4vr4xnSDxMaL',    // Bella - female voice
  'Layla': 'AZnzlk1XvdvUeBnXmlld',   // Domi - expressive female
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id, model_id = 'eleven_multilingual_v2' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Debug: Check if API key is configured
    console.log('🔑 ElevenLabs API Key Status:', ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Not configured');
    if (ELEVENLABS_API_KEY) {
      console.log('🔑 API Key Preview:', ELEVENLABS_API_KEY.substring(0, 10) + '...');
    }

    // Check if API key is configured
    if (!ELEVENLABS_API_KEY) {
      console.log('ElevenLabs API key not configured - using browser fallback');
      return NextResponse.json({ 
        message: 'ElevenLabs API key not configured. Using browser fallback.',
        success: false 
      }, { status: 503 });
    }

    const selectedVoiceId = ARABIC_VOICES[voice_id as keyof typeof ARABIC_VOICES] || ARABIC_VOICES.Haytham;

    console.log('🎤 Making ElevenLabs API call with voice:', selectedVoiceId);

    const response = await fetch(`${ELEVENLABS_API_URL}/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    console.log('📡 ElevenLabs API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs API Error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✅ ElevenLabs API Success - Audio size:', audioBuffer.byteLength, 'bytes');
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false 
    }, { status: 500 });
  }
} 