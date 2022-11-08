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


export function getNowDateWithString() {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ("00" + (dt.getMonth() + 1)).slice(-2);
  const d = ("00" + dt.getDate()).slice(-2);
  const h = ("00" + dt.getHours()).slice(-2);
  const minute = ("00" + dt.getMinutes()).slice(-2);
  const s = ("00" + dt.getSeconds()).slice(-2);
  const result = `${y}/${m}/${d} ${h}:${minute}:${s}`;
  return result;
}