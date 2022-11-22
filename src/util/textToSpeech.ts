export function speak(text: string, voice: SpeechSynthesisVoice | null): boolean {
  try {
    const utter = new SpeechSynthesisUtterance(text);
    if (voice) {
      utter.voice = voice;
    }
    speechSynthesis.speak(utter)
    return true
  } catch (e) {
    return false
  }
}

export function getNowDateWithString(dt: Date = new Date()) {
  const y = dt.getFullYear();
  const m = ("00" + (dt.getMonth() + 1)).slice(-2);
  const d = ("00" + dt.getDate()).slice(-2);
  const h = ("00" + dt.getHours()).slice(-2);
  const minute = ("00" + dt.getMinutes()).slice(-2);
  const s = ("00" + dt.getSeconds()).slice(-2);
  const result = `${y}/${m}/${d} ${h}:${minute}:${s}`;
  return result;
}
