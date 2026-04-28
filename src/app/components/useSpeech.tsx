import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback(async (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 1.1;
      const voice = await _getPreferredVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}

function _loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);

  return new Promise(resolve => {
    const handler = () => {
      const loaded = window.speechSynthesis.getVoices();
      if (loaded.length > 0) {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(loaded);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
  });
}

async function _getPreferredVoice(): Promise<SpeechSynthesisVoice | null> {
  const voices = await _loadVoices();

  // Only consider Italian voices — setting a non-Italian voice overrides lang='it-IT'
  const itVoices = voices.filter(v => v.lang.startsWith('it'));

  const preferred = ['Giuseppe', 'Alice', 'Microsoft Cosimo', 'Microsoft Elsa', 'Isabella'];
  for (const name of preferred) {
    const match = itVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (match) return match;
  }

  // First Italian voice available, or null (rely on lang tag alone)
  return itVoices[0] ?? null;
}
