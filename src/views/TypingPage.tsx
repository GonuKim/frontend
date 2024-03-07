import React, { useEffect, useState } from 'react';
import Key from '../views/Key';
import styles from "../css/Typing.module.css"
import { FaClock } from "react-icons/fa";
import { MdOutlineKeyboardAlt } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";

const TypingPage: React.FC = () => {
  const [pressedCode, setPressedCode] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedCode(event.code);

      // 시작 시간 설정
      if (startTime === 0) {
        setStartTime(Date.now());
      }

      // 텍스트 입력 추적
      const charTyped = event.key;
      setTypedText(prevTypedText => prevTypedText + charTyped);
    };

    const handleKeyUp = () => {
      setPressedCode('');

      // 모든 문자를 입력한 경우 종료 시간 설정
      if (typedText.length === inputText.length) {
        setEndTime(Date.now());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startTime, endTime, typedText, inputText]);


  const keyRows = [
    [{ code: 'Digit1', label: '1' }, { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' }, { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' },
     { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' }, { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' }, { code: 'Digit0', label: '0' },
     { code: 'Minus', label: '-' }, { code: 'Equal', label: '=' }],
    [{ code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' },
     { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' },
     { code: 'BracketLeft', label: '[' }, { code: 'BracketRight', label: ']' }, { code: 'Backslash', label: '\\' }],
    [{ code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' },
     { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: ';' },
     { code: 'Quote', label: '\'' },{ code: 'Enter', label: 'Enter' }],
    [{ code: 'KeyZ', label: 'Z' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' },
     { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '/' }]
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;
    setInputText(userInput);

    // 시작 시간 설정
    if (!startTime) {
      setStartTime(Date.now());
    }

    // 모든 문자를 입력한 경우 종료 시간 설정
    if (userInput === sentences) {
      setEndTime(Date.now());
    }
  };

  const sentences = "예, 야권 선거 구도의 또 다른 변화가 나왔다고 봐야겠는데요. 조금 전부터 '친문 좌장' 홍영표 의원 등 탈당파를 위주로 한 의원들의 기자회견이 열렸습니다.";

  const calculateElapsedTime = () => {
    if (!startTime || !endTime) {
      return 0;
    }
    return (endTime - startTime) / 1000;
  };

  const calculateWordsPerMinute = () => {
    const elapsedTime = calculateElapsedTime();
    const totalChars = sentences.length;
    const wordsPerMinute = (totalChars / elapsedTime) * 60;
    return Math.round(wordsPerMinute);
  };

  const calculateAccuracy = () => {
    const totalChars = sentences.length;
    const correctChars = inputText.split('').filter((char, index) => char === sentences[index]).length;
    const accuracy = (correctChars / totalChars) * 100;
    return isNaN(accuracy) ? 0 : Math.round(accuracy);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.stats_wrap}>
        <div className={styles.stats}>
          <div className={styles.top_status_container}>
            <div className={styles.status_wrap}>
              <p><FaClock className={styles.FaClock} />시간: {calculateElapsedTime()} seconds</p>
            </div>
            <div className={styles.status_wrap}>
              <p><MdOutlineKeyboardAlt className={styles.MdOutlineKeyboardAlt} />타자속도: {calculateWordsPerMinute()}</p>
            </div>
            <div className={styles.status_wrap}>
               <p><FiCheckSquare className={styles.FiCheckSquare } />정확도: {calculateAccuracy()}%</p>
            </div>
          </div>
          <div className={styles.sentences}>
            <p>
              {sentences.split('').map((char, index) => (
                <span key={index} style={{ color: inputText[index] !== char ? 'blue' : 'inherit' }}>
                  {char}
                </span>
              ))}
            </p>
          </div>
          <div className={styles.input_container}>
            <input
              className={styles.text_input}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="텍스트를 입력 해주세요."
            />
          </div>
        </div>
      </div>
      <div className={styles.main_wrap}>
        <div className={styles.keyboard}>
          {keyRows.map((row, index) => (
            <div key={index} className={styles.key_row}>
              {row.map(({ code, label }) => (
                <Key
                  key={code}
                  code={code}
                  label={label}
                  isPressed={pressedCode === code}
                  onKeyPress={setPressedCode}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingPage;
