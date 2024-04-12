interface KeyData {
  code: string;
  label: string;
}

export const keyRows: KeyData[][] = [
  [
    { code: "KeyQ", label: "Q" },
    { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" },
    { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },
    { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" },
    { code: "Backslash", label: "\\" },
  ],
  [
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" },
    { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";" },
    { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter" },
  ],
  [
    { code: "KeyZ", label: "A" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },
  ],
];

/*
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedCode(event.code);

      if (event.key === "Enter" && showModal) {
        setShowModal(false); // 모달이 열려있는 경우에는 모달을 닫음
        event.preventDefault(); // 기본 동작(새 줄 추가)을 막음
      } else if (event.key === "Enter") {
        calculateElapsedTime();
        calculateAccuracy();
        calculateTypingSpeed(); // 타자 입력 후 타수 계산
        setShowModal(true);
        setEndTime(0);
        setStartTime(0);
        setInputText("");
        fetchSentences(); // 새로운 문장을 불러옴 // FIXME: 더이상 문자없을 때 가져오게 끔 해야함

        event.preventDefault(); // 기본 동작(새 줄 추가)을 막음
      }

      setEndTime(Date.now());
      const charTyped = event.key;
      setTypedText((prevTypedText) => prevTypedText + charTyped);
    };

    const handleKeyUp = () => {
      setPressedCode("");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startTime, endTime, typedText, inputText, showModal, setPressedCode]);
  */
