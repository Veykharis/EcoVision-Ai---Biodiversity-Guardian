/**
 * EcoVision AI — ElevenLabs Voice Telemetry & Speech Synthesis Service
 * Converts AI field insights and urgent ecological dispatches into lifelike human audio.
 * Includes automatic Web Speech API fallback when ELEVENLABS_API_KEY is not set.
 */

import { Response } from 'express';

// Standard ElevenLabs Voice IDs
// 'pNInz6obpgDQGcFmaJgB' -> Adam (Authoritative Ranger Voice)
// '21m00Tcm4TlvDq8ikWAM' -> Rachel (Calm Scientific Voice)
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB';

export async function synthesizeSpeech(text: string, res: Response, voiceId: string = DEFAULT_VOICE_ID): Promise<void> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === 'MY_ELEVENLABS_API_KEY') {
    // Return fallback flag if no key configured
    res.json({
      success: true,
      fallback: true,
      text,
      message: 'ELEVENLABS_API_KEY not configured. Using browser Web Speech API audio fallback.'
    });
    return;
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('ElevenLabs API error response:', errText);
      res.json({
        success: true,
        fallback: true,
        text,
        message: 'ElevenLabs API call failed, using Web Speech API fallback.'
      });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length
    });
    res.send(buffer);
  } catch (error) {
    console.error('Error synthesizing speech via ElevenLabs:', error);
    res.json({
      success: true,
      fallback: true,
      text,
      message: 'ElevenLabs network error, using Web Speech API fallback.'
    });
  }
}
