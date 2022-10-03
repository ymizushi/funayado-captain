import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useJapaneseVoice(
): [SpeechSynthesisVoice[], Dispatch<SetStateAction<SpeechSynthesisVoice[]>>] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  if (process.browser) {
    useEffect(() => {
      setVoices(window.speechSynthesis.getVoices().filter(voice => voice.lang.includes('ja-JP')))
    }, [window.speechSynthesis])
  }
  return [voices, setVoices]
}