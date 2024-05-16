import React, { useState, useEffect, useContext, useCallback } from "react";
import styles from "../css/CreateWordPage.module.css";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import instance from "../api/axios";
import axios from "axios";
import { DataContext } from "../contexts/DataContext"; // useData 훅 import
import LoadingBar from "../components/LoadingBar";
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";

interface WordsState {
  is_public: boolean;
  title: string;
  kanji: string[];
  meaning: string[];
  gana: string[];
}

const EditWordPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [isPublicCheck, setIsPublicCheck] = useState<boolean>(false);

  const { OCRData, parsedExcelData } = useContext(DataContext) || {};
  const { clearOCRData, clearParsedExcelData } = useContext(DataContext) || {};

  // 데이터를 받아온 후 OCRData, parsedExcelData 초기화 하는 함수
  const processData = useCallback(() => {
    clearOCRData?.();
    clearParsedExcelData?.();
  }, [clearOCRData, clearParsedExcelData]);

  const initialWords: WordsState = {
    is_public: isPublicCheck,
    title: "",
    kanji: Array(10).fill(""),
    meaning: Array(10).fill(""),
    gana: Array(10).fill(""),
  };
  const [words, setWords] = useState<WordsState>(initialWords);
  const [externalData, setExternalData] = useState<WordsState | null>(null);

  useEffect(() => {
    console.log("체크?", isPublicCheck, words);
  }, [isPublicCheck, words]);

  // 페이지 이동 시 단어장 데이터 불러오기
  useEffect(() => {
    const getSetData = async () => {
      setLoading(true);

      try {
        const response = await instance.get(`api/vocabularyNote/${id}`);
        console.log("가져온 단어장 데이터", response.data);
        if (response.data.status === "Success") {
          const data = response.data.note;

          const parsedKanji = JSON.parse(data.kanji) || [];
          const parsedMeaning = JSON.parse(data.meaning) || [];
          const parsedGana = JSON.parse(data.gana) || [];
          //나중에 지우기 콘솔로그
          console.log(parsedMeaning);
          console.log(parsedKanji);
          console.log(parsedGana);
          //////////////////////
          const parsedWords = {
            title: data.title,
            gana: parsedGana,
            kanji: parsedKanji,
            meaning: parsedMeaning,
            is_public: isPublicCheck,
          };

          setIsPublicCheck(data.is_public);
          setWords(parsedWords);
          //나중에 지우기 콘솔로그
          console.log(parsedWords);

          console.log("setWords", words);
          //////////////////////
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error data:", error.response?.data);
          console.error("Error status:", error.response?.status);
        } else {
          console.error("An unexpected error occurred");
        }
      }
      setLoading(false);
    };
    getSetData();
  }, [id]);

  // 빈 열 검사 기능..
  const isDataNotEmpty = (
    data: { gana: string[]; kanji: string[]; meaning: string[] } | undefined
  ) => {
    return (
      data &&
      (data.kanji.length > 0 || data.meaning.length > 0 || data.gana.length > 0)
    );
  };

  // 완전히 비어있는 input 열 제거
  const filterEmptyWords = () => {
    setWords((currentWords) => {
      const filteredKanji = currentWords.kanji.filter(
        (_, index) =>
          currentWords.kanji[index] ||
          currentWords.meaning[index] ||
          currentWords.gana[index]
      );
      const filteredMeaning = currentWords.meaning.filter(
        (_, index) =>
          currentWords.kanji[index] ||
          currentWords.meaning[index] ||
          currentWords.gana[index]
      );
      const filteredGana = currentWords.gana.filter(
        (_, index) =>
          currentWords.kanji[index] ||
          currentWords.meaning[index] ||
          currentWords.gana[index]
      );

      return {
        ...currentWords,
        kanji: filteredKanji,
        meaning: filteredMeaning,
        gana: filteredGana,
      };
    });
  };

  // OCR, EXCEL 데이터를 저장 후 words에 추가
  useEffect(() => {
    let newData: WordsState | null = null;

    const convertNullToEmptyString = (array: (string | null)[]) =>
      array.map((item) => (item === null ? "" : item));

    if (isDataNotEmpty(OCRData)) {
      newData = {
        title: "",
        kanji: convertNullToEmptyString(OCRData?.kanji || []),
        meaning: convertNullToEmptyString(OCRData?.meaning || []),
        gana: convertNullToEmptyString(OCRData?.gana || []),
        is_public: isPublicCheck,
      };
    } else if (isDataNotEmpty(parsedExcelData)) {
      newData = {
        title: "",
        kanji: convertNullToEmptyString(parsedExcelData?.kanji || []),
        meaning: convertNullToEmptyString(parsedExcelData?.meaning || []),
        gana: convertNullToEmptyString(parsedExcelData?.gana || []),
        is_public: isPublicCheck,
      };
    }

    setExternalData(newData);
    newData = null;
    console.log("data11", newData);
  }, [OCRData, parsedExcelData, processData]);

  // externalData를 기반으로 words 업데이트
  useEffect(() => {
    console.log("exterData는", externalData);

    if (externalData) {
      setWords((currentWords) => ({
        ...currentWords,
        kanji: [...currentWords.kanji, ...externalData.kanji],
        meaning: [...currentWords.meaning, ...externalData.meaning],
        gana: [...currentWords.gana, ...externalData.gana],
      }));
      setExternalData(null);
      processData();
      filterEmptyWords();
    }
  }, [externalData, parsedExcelData, processData]);

  //단어, 세트명 관련 기능들...
  const addWord = () => {
    setWords({
      ...words,
      kanji: [...words.kanji, ""],
      meaning: [...words.meaning, ""],
      gana: [...words.gana, ""],
    });
  };

  const updateSetName = (value: string) => {
    console.log("sss", OCRData);
    setWords({ ...words, title: value });
  };

  const updateWord = (
    index: number,
    field: "kanji" | "meaning" | "gana",
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

  const [modalType, setModalType] = useState<string | null>(null);

  // 모달을 여는 함수
  const openModal = (type: string) => setModalType(type);

  // 모달을 닫는 함수
  const closeModal = () => setModalType(null);

  // 단어장 저장 api
  const sendWordData = async () => {
    filterEmptyWords();

    // 단어제목이나 단어가 비어있을 시 저장을 막고 경고창.
    if (!words.title.trim() || words.kanji.length === 0) {
      alert("세트 제목을 입력하거나 최소 한 단어를 추가해야 합니다.");
      return;
    }

    const updatedWords = {
      ...words,
      is_public: isPublicCheck, // 여기서 is_public만 업데이트
    };

    console.log("words=::", words);
    try {
      console.log("words:::");
      const response = await instance.patch(
        `/api/vocabularyNote/${id}`,
        updatedWords
      );
      console.log("Data sent successfully:", response.data);
      alert("수정되었습니다.");
      navigate(`/set/${id}`, { state: { id: id } });
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
      kanji: words.kanji.filter((_, idx) => idx !== index),
      meaning: words.meaning.filter((_, idx) => idx !== index),
      gana: words.gana.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className={styles.main_wrap}>
      {loading && <LoadingBar />}

      <div className={styles.set_name_wrap}>
        <div className={styles.set_name_input_wrap}>
          <input
            className={styles.set_name_input}
            placeholder="세트명을 입력하세요. (예: JLPT N1 단어)"
            type="text"
            value={words.title}
            required
            onChange={(e) => updateSetName(e.target.value)}
          />
        </div>
        <div className={styles.external_res_wrap}>
          <h4
            className={styles.external_excel}
            onClick={() => openModal("EXCEL")}
            style={{ cursor: "pointer" }}
          >
            EXCEL로 단어 입력
          </h4>
          <h4 onClick={() => openModal("OCR")} style={{ cursor: "pointer" }}>
            OCR로 단어 입력
          </h4>

          <div className={styles.check_wrap}>
            <Form.Check
              type="checkbox"
              id="checkbox"
              label="공개할까요?"
              checked={isPublicCheck}
              onChange={(e) => setIsPublicCheck(e.target.checked)}
            />
          </div>
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
                value={words.gana[index]}
                onChange={(e) => updateWord(index, "gana", e.target.value)}
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
      {modalType && <Modal type={modalType} closeModal={closeModal} />}
    </div>
  );
};

export default EditWordPage;
