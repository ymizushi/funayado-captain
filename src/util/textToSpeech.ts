

export const speak: (text: string, voice: SpeechSynthesisVoice) => void = (text, voice) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    window.speechSynthesis.speak(utter);
}