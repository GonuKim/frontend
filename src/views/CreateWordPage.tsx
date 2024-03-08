import React, { useState, useEffect } from "react";
import styles from "../css/CreateWordPage.module.css";
import { FaCirclePlus } from "react-icons/fa6";
import Modal from "../components/Modal";
interface WordsState {
  kanji: string[];
  meaning: string[];
  kana: string[];
}

const CreateWord: React.FC = () => {
  const initialWords: WordsState = {
    kanji: Array(10).fill(""),
    meaning: Array(10).fill(""),
    kana: Array(10).fill(""),
  };

  const [words, setWords] = useState<WordsState>(initialWords);

  const addWord = () => {
    setWords({
      kanji: [...words.kanji, ""],
      meaning: [...words.meaning, ""],
      kana: [...words.kana, ""],
    });
  };

  const updateWord = (
    index: number,
    field: keyof WordsState,
    value: string
  ) => {
    const updated = words[field].map((item, idx) =>
      idx === index ? value : item
    );
    setWords({ ...words, [field]: updated });
  };

  useEffect(() => {
    console.log(words);
  }, [words]);

  const formatNumber = (number: number) => {
    return number.toString().padStart(3, "0");
  };

  const [modalType, setModalType] = useState<string | null>(null);

  // 모달을 여는 함수
  const openModal = (type: string) => setModalType(type);

  // 모달을 닫는 함수
  const closeModal = () => setModalType(null);

  return (
    <div className={styles.main_wrap}>
      <div className={styles.set_name_wrap}>
        <div className={styles.set_name_input_wrap}>
          <input
            className={styles.set_name_input}
            placeholder="세트명을 입력하세요. (예: JLPT N1 단어)"
            type="text"
          />
        </div>
        <div className={styles.external_res_wrap}>
          <h4
            className={styles.external_excel}
            onClick={() => openModal("EXCEL")}
          >
            EXCEL로 단어 입력
          </h4>
          <h4 onClick={() => openModal("OCR")}>OCR로 단어 입력</h4>
        </div>
      </div>

      <div className={styles.word_input_main_wrap}>
        <div className={styles.word_input_top_text}>
          <h3>한자</h3>
          <h3>의미</h3>
          <h3>가나</h3>
        </div>

        <div className={styles.word_input_wrap}>
          {words.kanji.map((_, index) => (
            <div key={index} className={styles.word_inputs}>
              <label htmlFor="">{formatNumber(index + 1)} </label>
              <input
                type="text"
                value={words.kanji[index]}
                onChange={(e) => updateWord(index, "kanji", e.target.value)}
              />
              <input
                type="text"
                value={words.meaning[index]}
                onChange={(e) => updateWord(index, "meaning", e.target.value)}
              />
              <input
                type="text"
                value={words.kana[index]}
                onChange={(e) => updateWord(index, "kana", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className={styles.add_item_btn} onClick={addWord}>
          <FaCirclePlus className={styles.plus_icon} />
          <h3 className={styles.plus_text}>항목 추가</h3>
        </div>

        <div className={styles.save_btn_wrap}>
          <button className={styles.save_btn}>세트 저장하기</button>
        </div>
      </div>
      {modalType && <Modal type={modalType} closeModal={closeModal} />}
    </div>
  );
};

export default CreateWord;
