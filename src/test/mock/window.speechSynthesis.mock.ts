export {}

Object.defineProperty(global, "SpeechSynthesisVoice", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});


Object.defineProperty(global, "SpeechSynthesisUtterance", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(global, "speechSynthesis", {
  writable: true,
  value: {}
})

Object.defineProperty(global.speechSynthesis, "speak", {
  writable: true,
  value: jest.fn().mockImplementation(utter => {
    return
  }),
});

