import { NextRequest, NextResponse } from 'next/server';

// Azure Speech Services configuration
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';

// Azure Arabic voices - these are high quality and free
const AZURE_ARABIC_VOICES = {
  'Haytham': 'ar-SA-HamedNeural',     // Saudi Arabic Male - clear and professional
  'Sana': 'ar-SA-ZariyahNeural',      // Saudi Arabic Female - warm and friendly
  'Layla': 'ar-EG-SalmaNeural',       // Egyptian Arabic Female - expressive
  'Omar': 'ar-EG-ShakirNeural',       // Egyptian Arabic Male - natural
  'Fatima': 'ar-AE-FatimaNeural',     // UAE Arabic Female - modern
  'Ahmed': 'ar-JO-TaimNeural',        // Jordanian Arabic Male - educational
};

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id = 'Haytham', emotion = 'neutral' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Check if Azure Speech key is configured
    if (!AZURE_SPEECH_KEY) {
      console.log('Azure Speech key not configured - using browser fallback');
      return NextResponse.json({ 
        message: 'Azure Speech key not configured. Using browser fallback.',
        success: false 
      }, { status: 503 });
    }

    const selectedVoice = AZURE_ARABIC_VOICES[voice_id as keyof typeof AZURE_ARABIC_VOICES] || AZURE_ARABIC_VOICES.Haytham;

    // Adjust speaking style based on emotion
    let style = 'general';
    let rate = '0%';
    switch (emotion) {
      case 'happy':
        style = 'cheerful';
        rate = '+10%';
        break;
      case 'excited':
        style = 'excited';
        rate = '+20%';
        break;
      case 'encouraging':
        style = 'friendly';
        rate = '+5%';
        break;
      case 'celebrating':
        style = 'excited';
        rate = '+25%';
        break;
      default:
        style = 'general';
    }

    // Improve Arabic pronunciation with diacritics
    const improvedText = text
      .replace(/مال/g, 'مَال')
      .replace(/ريال/g, 'رِيَال')
      .replace(/ادخار/g, 'اِدِّخَار')
      .replace(/شراء/g, 'شِرَاء')
      .replace(/حصالة/g, 'حُصَّالة')
      .replace(/ممتاز/g, 'مُمتَاز')
      .replace(/رائع/g, 'رَائِع')
      .replace(/أحسنت/g, 'أَحسَنت')
      .replace(/فكر/g, 'فَكِّر')
      .replace(/معي/g, 'مَعِي')
      .replace(/متأكد/g, 'مُتَأكِّد')
      .replace(/نحتاج/g, 'نَحتَاج')
      .replace(/بابا/g, 'بَابَا')
      .replace(/ماما/g, 'مَامَا');

    // Create SSML for better control
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">
        <voice name="${selectedVoice}">
          <prosody rate="${rate}" pitch="0%" volume="loud">
            <emphasis level="moderate">${improvedText}</emphasis>
          </prosody>
        </voice>
      </speak>
    `;

    console.log('🎤 Making Azure Speech API call:', {
      voice: selectedVoice,
      emotion,
      style,
      textLength: text.length
    });

    const response = await fetch(
      `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
        },
        body: ssml,
      }
    );

    console.log('📡 Azure Speech API Response:', {
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Azure Speech API Error:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Azure Speech API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✅ Azure Speech API Success - Audio size:', audioBuffer.byteLength, 'bytes');
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Azure Speech TTS error:', error);
    return NextResponse.json({ 
      error: 'TTS service unavailable',
      success: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 