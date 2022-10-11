export const speak: (
  text: string,
  voice: SpeechSynthesisVoice | null
) => void = (text, voice) => {
  const utter = new SpeechSynthesisUtterance(text);
  if (voice) {
    utter.voice = voice;
  }
  window.speechSynthesis.speak(utter);
};
