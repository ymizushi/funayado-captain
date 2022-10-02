export const speak: (text: string) => void = text => {
    const utter = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices()[0];
    utter.voice = voice;
    window.speechSynthesis.speak(utter);
}