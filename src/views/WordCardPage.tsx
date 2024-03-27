import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../css/WordCardPage.module.css";
import instance from "../api/axios";
import axios from "axios";
import LoadingBar from "../components/LoadingBar";

interface Word {
  kanji: string;
  meaning: string;
  gana: string;
}

interface Info {
  title: string;
  count: number;
}

const WordCardPage: React.FC = () => {
  const { id } = useParams();
  const [words, setWords] = useState<Word[]>([]);
  const [info, setInfo] = useState<Info>({ title: "", count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSetData = async () => {
      setLoading(true);

      const accessToken = sessionStorage.getItem("accessToken");
      try {
        const response = await instance.get(`api/vocabularyNote/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data.status === "Success") {
          const data = response.data.data;

          const parsedKanji = JSON.parse(data.kanji) || [];
          const parsedMeaning = JSON.parse(data.meaning) || [];
          const parsedGana = JSON.parse(data.gana) || [];
          //나중에 지우기 콘솔로그
          console.log(parsedMeaning);
          console.log(parsedKanji);
          console.log(parsedGana);
          //////////////////////
          const parsedWords = parsedKanji.map(
            (kanji: string, index: number) => ({
              kanji: kanji || parsedGana[index],
              meaning: parsedMeaning[index] || "",
              gana: parsedGana[index] || "",
            })
          );

          setWords(parsedWords);
          setInfo({ title: data.title, count: parsedWords.length });
          //나중에 지우기 콘솔로그
          console.log(parsedWords);
          console.log(parsedWords.length);
          console.log("setWords", words);
          console.log("setInfo", info);
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

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}
      <div className={styles.top_name_container}>
        <div className={styles.title_container}>
          <h2 className={styles.set_name}>{info.title}</h2>
          <p className={styles.card_num}>{info.count} 카드</p>
        </div>
      </div>
      <div className={styles.btn_container}>
        <Link
          to={`/Memorize/${id}`}
          state={{ words: words, title: info.title }}
        >
          <button>암기학습</button>
        </Link>
      </div>

      <div className={styles.card_main_container}>
        {words.map((word, index) => (
          <div key={index} className={styles.card_wrap}>
            <div className={styles.kanji_wrap}>
              <p className={styles.text_kanji}>{word.kanji}</p>
            </div>

            <div className={styles.mean_gana_wrap}>
              <p className={styles.text_mean}>의미: {word.meaning}</p>
              <p className={styles.text_gana}>가나: {word.gana}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordCardPage;
