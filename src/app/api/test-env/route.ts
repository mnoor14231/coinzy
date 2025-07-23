import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'Not set',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('ELEVENLABS'))
  });
} 