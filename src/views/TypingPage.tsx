import React, { useEffect, useState } from "react";
import Key from "../views/Key";
import styles from "../css/Typing.module.css";
import { FaClock } from "react-icons/fa";
import { MdOutlineKeyboardAlt } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import { keyRows } from "../constants/typing";
import { getSentences } from "../api/typing";

const calculateCPM = (text: string, secs: number) => text.length / (secs / 60);

const TypingPage: React.FC = () => {
  const [pressedCode, setPressedCode] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [sentences, setSentences] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const fns = {
    // 타수 계산
    calculateCpm: () => {
      console.log(typedText);
      const calculatedCPM = calculateCPM(typedText, elapsedTime);
      setCpm(calculatedCPM);
    },
    // 정확도 계산
    calculateAccuracy: () => {
      const totalChars = sentences.length;
      const correctChars = inputText
        .split("")
        .filter((char, index) => char === sentences[index]).length;
      const accuracy = (correctChars / totalChars) * 100;
      setAccuracy(isNaN(accuracy) ? 0 : Math.round(accuracy));
    },
    // 경과시간 계산
    calculateElapsedTime: () => {
      if (!startTime) return 0;
      const elapsedTimeInSeconds = Math.round(
        (Date.now() - (startTime ?? 0)) / 1000
      );
      setElapsedTime(elapsedTimeInSeconds);
      console.log("elapsedTimeInSeconds", elapsedTimeInSeconds);
      return elapsedTimeInSeconds;
    },
    // 문장 업데이트
    fetchSentences: async () => {
      try {
        const sentences = await getSentences();

        const randomIndex = Math.floor(Math.random() * sentences.length);
        const selectedSentence = sentences[randomIndex];
        //   문장을 JSX로 변환하여 상태에 설정
        setSentences(selectedSentence);
      } catch (error) {
        console.error("Error fetching sentences:", error);
      }
    },
  };

  const handler = {
    input: {
      keyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        setPressedCode(e.code);

        // 모달이 켜져있으면, 모달창 닫기
        if (showModal) {
          setShowModal(false);
          return;
        }

        // 타이핑 시작 시, 타이머를 초기화하고 시작
        if (!startTime && e.key !== "Enter") {
          setStartTime(Date.now());
          setElapsedTime(0);
        }
        console.log(e.key);
        // 엔터 키가 눌렸을 때, 타이머 중지
        if (e.key === "Enter") {
          setStartTime(null); // 타이머를 중지하기 위해 startTime을 null로 설정
          setShowModal(true); // 결과 모달 표시
          // 타이핑 관련 계산 및 초기화 로직
          fns.calculateAccuracy();
          fns.calculateCpm();
          fns.fetchSentences();
        } else if (e.key === "Backspace") {
          setTypedText((p) => p.slice(1));
        } else {
          const charTyped = "1";
          setTypedText((p) => p + charTyped);
        }
      },
      change: (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setInputText(userInput);

        if (startTime === 0 && userInput.length > 0) {
          setStartTime(Date.now());
          return;
        }

        fns.calculateElapsedTime();
        fns.calculateAccuracy(); // 정확도 계산 수정 실시간 정확도로
        fns.calculateCpm();
      },
    },
    grade: {
      set: (e: React.MouseEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value);
      },
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime((oldElapsedTime) => oldElapsedTime + 1);
      }, 1000);
    }

    // 컴포넌트가 언마운트되거나 엔터 키가 눌렸을 때 인터벌 클리어
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime]);

  // 타자가 입력되거나, 시간이 갱신될 때 타수 계산
  useEffect(fns.calculateCpm, [typedText, elapsedTime]);

  useEffect(() => {
    fns.fetchSentences();
  }, []);

  useEffect(() => {
    if (showModal) return;
    setInputText(""); // 입력 필드 초기화
    setTypedText(""); // 입력된 텍스트 초기화
  }, [showModal]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.top_name_container}>
        <p className={styles.top_name_text}>Typing Page</p>
      </div>

      <div className={styles.whole_container}>
        <div className={styles.list_container}>
          <div className={styles.grade_container}>
            <div className={styles.select_grade_wrap}>
              {["기본 문장", "유저 문장"].map((grade, index) => (
                <motion.div
                  key={index}
                  onClick={handler.grade.set}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    scale: selectedGrade === grade ? 1.1 : 1,
                    backgroundColor: selectedGrade === grade ? "#fafafa" : "",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={styles.grade_items}
                >
                  {grade}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.stats_wrap}>
          <div className={styles.stats}>
            <div className={styles.top_status_container}>
              <div className={styles.status_wrap}>
                <p>
                  <FaClock className={styles.FaClock} />
                  {/* 시간: {Math.floor(elapsedTime / 60).toFixed(0)} 분{" "} */}
                  시간: {Math.floor(elapsedTime / 60).toFixed(0)} 분{" "}
                  {(elapsedTime % 60).toFixed(0)} 초
                </p>
              </div>
              <div className={styles.status_wrap}>
                <p>
                  <MdOutlineKeyboardAlt
                    className={styles.MdOutlineKeyboardAlt}
                  />
                  타자속도:{cpm.toFixed(2)} CPM
                </p>
              </div>
              <div className={styles.status_wrap}>
                <p>
                  <FiCheckSquare className={styles.FiCheckSquare} />
                  정확도: {accuracy.toFixed(2)}%
                </p>
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
                onChange={handler.input.change}
                //onKeyDown={(e) => handleKeyPress(e.code)}
                onKeyDown={handler.input.keyDown}
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
              <p>타자속도: {cpm.toFixed(2)} CPM</p>
              <p>
                시간: {Math.floor(elapsedTime / 60)} 분 {elapsedTime % 60} 초
              </p>
              <p>정확도: {accuracy.toFixed(2)}%</p>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingPage;
