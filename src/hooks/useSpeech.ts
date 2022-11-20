import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export function useSpeech(): [
  SpeechSynthesisVoice | null,
  Dispatch<SetStateAction<SpeechSynthesisVoice | null>>,
  SpeechSynthesisVoice[],
  Dispatch<SetStateAction<SpeechSynthesisVoice[]>>
] {
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  const setVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);
    let defaultVoice = null;
    if (voices.length > 0) {
      defaultVoice = window.speechSynthesis.getVoices()[0];
    }
    setSelectedVoice(defaultVoice);
  }, [setAvailableVoices]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };
    setVoice;
  }, [setVoice]);

  return [selectedVoice, setSelectedVoice, availableVoices, setAvailableVoices];
}
