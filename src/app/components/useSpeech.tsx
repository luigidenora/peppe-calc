import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback(async (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      //imposta la voce italiana più naturale disponibile
      const voice = await _getPreferredVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = 'it-IT';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}


function _loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    return voices;
  }

  return new Promise(resolve => {
    const handler = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      if (loadedVoices.length > 0) {
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(loadedVoices);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
  });
}
/**
 * Returns the preferred .
 */
async function _getPreferredVoice(): Promise<SpeechSynthesisVoice | null> {
  const voices = await _loadVoices();

  const isFemale = false;

  const preferredFemale = ['Isabella', 'Alice', 'Microsoft Elsa', 'Google UK English Female'];
  const preferredMale = ['Giuseppe', 'Microsoft Cosimo', 'Google UK English Male'];

  const preferredList = isFemale ? preferredFemale : preferredMale;

  for (const name of preferredList) {
    const voice = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (voice) return voice;
  }

  const fallback = voices.find(v =>
    isFemale ? v.name.toLowerCase().includes('female') : v.name.toLowerCase().includes('male'),
  );

  return fallback ?? voices[0];
}