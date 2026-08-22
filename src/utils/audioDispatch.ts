/**
 * EcoVision AI — Audio Dispatch Utility
 * Synthesizes voice audio via ElevenLabs API with automatic Web Speech API fallback.
 * Supports global user ON/OFF voice toggle preference.
 */

// Voice Audio Toggle State (persisted in localStorage, default = OFF for privacy/noise)
let isVoiceEnabledState: boolean = (() => {
  try {
    return localStorage.getItem('ecovision_voice_enabled') === 'true';
  } catch {
    return false;
  }
})();

export function isVoiceEnabled(): boolean {
  return isVoiceEnabledState;
}

export function setVoiceEnabled(enabled: boolean): void {
  isVoiceEnabledState = enabled;
  try {
    localStorage.setItem('ecovision_voice_enabled', String(enabled));
  } catch {}

  // If turning off, stop ongoing speech immediately
  if (!enabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function speakAudioDispatch(text: string, force: boolean = false): Promise<void> {
  if (!text) return;
  
  // If voice is OFF and user didn't explicitly force click, skip playback
  if (!isVoiceEnabledState && !force) {
    return;
  }

  try {
    const res = await fetch('/api/v1/tts/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('audio/mpeg')) {
      // Audio stream returned from ElevenLabs API
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      // Fallback response: use Web Speech API in browser
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  } catch (err) {
    console.warn('Audio dispatch failed, falling back to browser synthesis:', err);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }
}
