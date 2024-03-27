import React, { useEffect, useState } from 'react';
import Key from '../views/Key';
import styles from "../css/Typing.module.css";
import { FaClock } from "react-icons/fa";
import { MdOutlineKeyboardAlt } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import instance from "../api/axios";

interface KeyData {
  code: string;
  label: string;
}

const TypingPage: React.FC = () => {
  const [pressedCode, setPressedCode] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [sentences, setSentences] = useState<string>('');

  const calculateTypingSpeed = () => {
    // 입력된 문자 수
    const typedChars = typedText.length /7;
    // 입력 시간을 초 단위로 변환

    // 타수 계산
    const typingSpeed = (typedChars / (5* elapsedTime / 60)) *2;

    setWpm(typingSpeed);
  };
  
  useEffect(() => {
    calculateTypingSpeed(); // 타자 입력이 변경될 때마다 타수 계산
  }, [typedText, elapsedTime]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedCode(event.code);
  
      if (event.key === 'Enter' && showModal) {
        setShowModal(false); // 모달이 열려있는 경우에는 모달을 닫음
        event.preventDefault(); // 기본 동작(새 줄 추가)을 막음
      } else if (event.key === 'Enter') {
        calculateElapsedTime();
        calculateAccuracy();
        calculateTypingSpeed(); // 타자 입력 후 타수 계산
        setShowModal(true);
        setEndTime(0);
        setStartTime(0);
        setInputText('');
        fetchSentences(); // 새로운 문장을 불러옴
        event.preventDefault(); // 기본 동작(새 줄 추가)을 막음
      }
  
      setEndTime(Date.now());
      const charTyped = event.key;
      setTypedText(prevTypedText => prevTypedText + charTyped);
    };
    
    const handleKeyUp = () => {
      setPressedCode('');
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startTime, endTime, typedText, inputText, showModal, setPressedCode]);
  
  useEffect(() => {
    fetchSentences();
  }, []);
  
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;
    setInputText(userInput);

    if (startTime === 0 && userInput.length === 1) {
      setStartTime(Date.now());
    }
  };

  const calculateElapsedTime = () => {
    const elapsedTimeInSeconds = Math.round((endTime - startTime) / 1000);
    setElapsedTime(elapsedTimeInSeconds);
    console.log("elapsedTimeInSeconds", elapsedTimeInSeconds)
  };

  const calculateTypingSpeedNew = () => {
    // 입력된 문자 수
    const typedChars = typedText.trim().length;
    // 입력 시간을 초 단위로 변환
    const elapsedTimeInSeconds = elapsedTime / 1000;
    // 타수 계산
  
    const typingSpeed = (typedChars / (elapsedTimeInSeconds / 60));
    setWpm(typingSpeed);

    
};


  const calculateAccuracy = () => {
    const totalChars = sentences.length;
    const correctChars = inputText
      .split("")
      .filter((char, index) => char === sentences[index]).length;
    const accuracy = (correctChars / totalChars) * 100;
    setAccuracy(isNaN(accuracy) ? 0 : Math.round(accuracy));
  };

  const keyRows: KeyData[][] = [
    [{ code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' },
     { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' },
     { code: 'BracketLeft', label: '[' }, { code: 'BracketRight', label: ']' }, { code: 'Backslash', label: '\\' }],
    [{ code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' },
     { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: ';' },
     { code: 'Quote', label: '\'' },{ code: 'Enter', label: 'Enter' }],
    [{ code: 'KeyZ', label:'A' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' },
     { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '/' }]
  ];



  const fetchSentences = async () => {
    try {
      // 1. 사용자가 인증되었는지 확인하고 토큰 
      const accessToken = sessionStorage.getItem("accessToken");
  
      // 2. 토큰이 있는 경우에만 API 요청 

        const response = await instance.get(
          "/api/typing/getSentences",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            
          }
        );
        console.log(response)
        const sentences: string[] = response.data.map((data: any) => data.sentence);
        const randomIndex = Math.floor(Math.random() * sentences.length);
        const selectedSentence = sentences[randomIndex];
        // 문장을 JSX로 변환하여 상태에 설정
        setSentences(selectedSentence)

  } catch (error) {
    console.error("Error fetching sentences:", error)
  }
}
  
  const handleKeyPress = (code: string) => {
    // 일본어 입력에 대한 처리를 추가
    // 예를 들어, 일본어 키 입력을 처리하여 typedText와 inputText를 업데이트
  };

  // useEffect(() => {
  //   fetchSentences();
  // })

  return (
  <div className={styles.pageContainer}>
    <div className={styles.stats_wrap}>
      <div className={styles.stats}>
        <div className={styles.top_status_container}>
          <div className={styles.status_wrap}>
            <p><FaClock className={styles.FaClock} />시간: {(Math.floor(elapsedTime / 60)).toFixed(0)} 분 {(elapsedTime % 60).toFixed(0)} 초</p>
          </div>
          <div className={styles.status_wrap}>
            <p><MdOutlineKeyboardAlt className={styles.MdOutlineKeyboardAlt} />타자속도:{wpm.toFixed(2)} WPM</p>
          </div>
          <div className={styles.status_wrap}>
            <p><FiCheckSquare className={styles.FiCheckSquare} />정확도: {accuracy.toFixed(2)}%</p>
          </div>
        </div>
        <div className={styles.sentences}>
          <p>
            {sentences.split("").map((char, index) => (
              <span
                key={index}
                style={{
                  color: inputText[index] !== char ? "white" : "lightgreen",
                }}
              >
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
            onKeyDown={(e) => handleKeyPress(e.code)}
            placeholder="텍스트를 입력 해주세요."
          />
        </div>
      </div>
    </div>
    <div className={styles.main_wrap}>
      <div className={styles.keyboard}>
        {keyRows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.key_row}>
            {row.map(({ code, label }, index) => (
              <Key
                key={index}
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
    {/* 모달 창 */}
    {showModal && (
      <div className={styles.modalBackground}>
        <div className={styles.modalContent}>
          <h2>결과</h2>
          <p>타자속도: {wpm.toFixed(2)} WPM</p>
          <p>시간: {(Math.floor(elapsedTime / 60)).toFixed(0)} 분 {(elapsedTime % 60).toFixed(0)} 초</p>
          <p>정확도: {accuracy.toFixed(2)}%</p>
          <button className={styles.closeButton} onClick={() => setShowModal(false)}>닫기</button>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default TypingPage;