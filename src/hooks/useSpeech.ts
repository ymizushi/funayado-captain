import { useCallback, useEffect, useState } from "react";


export function useSpeech() {
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useCallback(() => {},
   []
  )

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
      if (window.speechSynthesis.getVoices().length > 0) {
        setSelectedVoice(window.speechSynthesis.getVoices()[0]);
      }
    };
    setAvailableVoices(window.speechSynthesis.getVoices());
    if (window.speechSynthesis.getVoices().length > 0) {
      setSelectedVoice(window.speechSynthesis.getVoices()[0]);
    }
  }, [setSelectedVoice, setAvailableVoices]);

}