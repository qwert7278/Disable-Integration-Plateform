type TTSState = 'idle' | 'speaking' | 'paused';
type TTSListener = (state: TTSState, text: string) => void;

let currentState: TTSState = 'idle';
let currentText: string = '';
const listeners: Set<TTSListener> = new Set();

const notify = () => {
  listeners.forEach(l => l(currentState, currentText));
};

export const subscribeTTS = (listener: TTSListener) => {
  listeners.add(listener);
  listener(currentState, currentText);
  return () => {
    listeners.delete(listener);
  };
};

export const unsubscribeTTS = (listener: TTSListener) => {
  listeners.delete(listener);
};

const getBestVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    'Microsoft HsiaoChen Online',
    'Microsoft Yunxi Online',
    'Google 國語',
    'Microsoft Hanhan',
    'Microsoft Tracy'
  ];

  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }

  return voices.find(v => v.lang.includes('zh-TW')) || 
         voices.find(v => v.lang.includes('zh-HK')) ||
         voices.find(v => v.lang.includes('zh-CN')) || 
         null;
};

export const speak = (text: string, rate: number = 1.1, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestVoice();
  
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.lang = 'zh-TW';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    currentState = 'speaking';
    currentText = text;
    notify();
  };

  utterance.onend = () => {
    currentState = 'idle';
    currentText = '';
    notify();
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentState = 'idle';
    currentText = '';
    notify();
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const pauseSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
    currentState = 'paused';
    notify();
  }
};

export const resumeSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
    currentState = 'speaking';
    notify();
  }
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentState = 'idle';
    currentText = '';
    notify();
  }
};

export const getTTSState = () => ({ state: currentState, text: currentText });
