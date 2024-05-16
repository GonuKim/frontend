import React, { useState } from "react";
import styles from "../css/CreateWordPage.module.css";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import axios from "axios";

interface WordsState {
  title: string;
  sentence: string[];
  meaning: string[];
}

const CreateWord: React.FC = () => {
  const navigate = useNavigate();

  const initialWords: WordsState = {
    title: "",
    meaning: Array(10).fill(""),
    sentence: Array(10).fill(""),
  };
  const [words, setWords] = useState<WordsState>(initialWords);

  // 완전히 비어있는 input 열 제거
  const filterEmptyWords = () => {
    setWords((currentWords) => {
      const filteredSentence = currentWords.sentence.filter(
        (_, index) =>
          currentWords.sentence[index] || currentWords.meaning[index]
      );
      const filteredMeaning = currentWords.meaning.filter(
        (_, index) =>
          currentWords.sentence[index] || currentWords.meaning[index]
      );

      return {
        ...currentWords,
        sentence: filteredSentence,
        meaning: filteredMeaning,
      };
    });
  };

  //단어, 세트명 관련 기능들...
  const addWord = () => {
    setWords({
      ...words,
      meaning: [...words.meaning, ""],
      sentence: [...words.sentence, ""],
    });
  };

  const updateSetName = (value: string) => {
    setWords({ ...words, title: value });
  };

  const updateWord = (
    index: number,
    field: "sentence" | "meaning",
    value: string
  ) => {
    const updated = words[field].map((item, idx) =>
      idx === index ? value : item
    );
    setWords({ ...words, [field]: updated });
  };

  // 001 002.. 앞에 00붙이기.
  const formatNumber = (number: number) => {
    return number.toString().padStart(3, "0");
  };

  // 단어장 저장 api
  const sendWordData = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    filterEmptyWords();

    // 단어제목이나 단어가 비어있을 시 저장을 막고 경고창.
    if (!words.title.trim() || words.sentence.length === 0) {
      alert("세트 제목을 입력하거나 최소 한 단어를 추가해야 합니다.");
      return;
    }

    console.log("words=::", words);
    try {
      console.log("words:::");
      const response = await instance.post("/api/vocabularyNote", words, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Data sent successfully:", response.data);
      alert("저장되었습니다.");
      navigate("/MySet");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        if (axios.isAxiosError(error)) {
          console.error("Error data:", error.response?.data);
          console.error("Error status:", error.response?.status);
        }
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  // 단어 삭제 기능
  const removeWord = (index: number) => {
    setWords({
      ...words,
      meaning: words.meaning.filter((_, idx) => idx !== index),
      sentence: words.sentence.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className={styles.main_wrap}>
      <div className={styles.set_name_wrap}>
        <div className={styles.set_name_input_wrap}>
          <input
            className={styles.set_name_input}
            placeholder="세트명을 입력하세요. (예: 필수 회화 문장)"
            type="text"
            value={words.title}
            required
            onChange={(e) => updateSetName(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.word_input_main_wrap}>
        <div className={styles.word_input_top_text}>
          <h3>문장</h3>
          <h3>의미</h3>
        </div>

        <div className={styles.word_input_wrap}>
          {words.sentence.map((_, index) => (
            <div key={index} className={styles.word_inputs}>
              <div className={styles.label_container}>
                <label htmlFor="">{formatNumber(index + 1)} </label>
                <MdDeleteForever
                  onClick={() => removeWord(index)}
                  style={{ cursor: "pointer" }}
                  className={styles.delete_btn}
                />
              </div>
              <input
                type="text"
                value={words.sentence[index]}
                onChange={(e) => updateWord(index, "sentence", e.target.value)}
              />
              <input
                type="text"
                value={words.meaning[index]}
                onChange={(e) => updateWord(index, "meaning", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className={styles.add_item_container} onClick={addWord}>
          <button className={styles.add_item_btn}>
            <FaCirclePlus className={styles.plus_icon} />
            <h3 className={styles.plus_text}>항목 추가</h3>
          </button>
        </div>

        <div className={styles.save_btn_wrap}>
          <button onClick={sendWordData} className={styles.save_btn}>
            세트 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWord;
