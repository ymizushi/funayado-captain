import "../mock/window.speechSynthesis.mock";

import { describe, expect, it } from "@jest/globals";
import { getNowDateWithString, speak } from "@/util/textToSpeech";

describe("getNowDateWithString", () => {
  it("return string format", () => {
    expect(getNowDateWithString(new Date(2022, 11, 22))).toStrictEqual(
      "2022/12/22 00:00:00"
    );
    expect(getNowDateWithString()).toBeDefined();
  });
});

describe("speak", () => {
  it("succeeded to speak", () => {
    expect(speak("text to speech", new SpeechSynthesisVoice())).toBeTruthy();
  });
  it("failed to speak", () => {
    Object.defineProperty(global.speechSynthesis, "speak", {
      writable: true,
      value: jest.fn().mockImplementation((utter) => {
        throw new Error();
      }),
    });

    expect(speak("text to speech", new SpeechSynthesisVoice())).toBeFalsy();
  });
});
