import React, { useEffect, useState } from "react";
import styles from "../css/GrammarPage.module.css";
import instance from "../api/axios";
import { AnimatePresence, motion } from "framer-motion";
import LoadingBar from "../components/LoadingBar";
import { IoBookSharp } from "react-icons/io5";
import { LuBringToFront } from "react-icons/lu";
import { FaBook } from "react-icons/fa";
import { BsFileText } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

interface GrammarExample {
  id: number;
  grammar_id: number;
  user_id: number;
  example: string; // 이 필드에는 '<br>'로 구분된 일본어 및 한국어 예문이 포함됩니다.
  created_at: string;
}

interface GrammarData {
  id: number;
  grammar: string;
  conjunction: string;
  explain: string;
  example: string;
  exampleKanji: string[];
  exampleKorean: string[];
  meaning: string;
  grammar_examples: GrammarExample[];
}
const GrammarPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarData | null>(
    null
  );

  //문법 데이터
  const [N1, setN1] = useState<GrammarData[]>([]);
  const [N2, setN2] = useState<GrammarData[]>([]);
  const [N3, setN3] = useState<GrammarData[]>([]);

  // modal 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  //문법 데이터 api
  useEffect(() => {
    setSelectedGrade("N1 문법");
    const getSetData = async () => {
      setLoading(true);
      const accessToken = sessionStorage.getItem("accessToken");

      try {
        const response = await instance.get(
          `/api/jlpt/grammar/`,

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("response.data", response.data);
        const data = response.data;
        const dataN1 = data.N1[0].grammars;
        console.log("data", dataN1);
        const formattedDataN1 = dataN1.map((grammarItem: GrammarData) => ({
          id: grammarItem.id,
          grammar: grammarItem.grammar.replace(/<br>/g, `\n`),
          conjunction: grammarItem.conjunction.replace(/<br>/g, `\n`),
          explain: grammarItem.explain.replace(/<br>/g, `\n`),
          exampleKanji: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[0] ? parts[0].trim() : "";
            }
          ),
          exampleKorean: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[1] ? parts[1].trim() : ""; // parts[1]이 undefined 일 수 있으므로 확인
            }
          ),
          meaning: grammarItem.meaning.replace(/<br>/g, `\n`),
        }));

        setN1(formattedDataN1);

        const dataN2 = data.N2[0].grammars;
        console.log("data", dataN2);
        const formattedDataN2 = dataN2.map((grammarItem: GrammarData) => ({
          id: grammarItem.id,
          grammar: grammarItem.grammar.replace(/<br>/g, `\n`),
          conjunction: grammarItem.conjunction.replace(/<br>/g, `\n`),
          explain: grammarItem.explain.replace(/<br>/g, `\n`),
          exampleKanji: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[0] ? parts[0].trim() : "";
            }
          ),
          exampleKorean: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[1] ? parts[1].trim() : ""; // parts[1]이 undefined 일 수 있으므로 확인
            }
          ),
          meaning: grammarItem.meaning.replace(/<br>/g, `\n`),
        }));

        setN2(formattedDataN2);

        const dataN3 = data.N3[0].grammars;
        console.log("data", dataN3);
        const formattedDataN3 = dataN3.map((grammarItem: GrammarData) => ({
          id: grammarItem.id,
          grammar: grammarItem.grammar.replace(/<br>/g, `\n`),
          conjunction: grammarItem.conjunction.replace(/<br>/g, `\n`),
          explain: grammarItem.explain.replace(/<br>/g, "<br/>"),
          exampleKanji: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[0] ? parts[0].trim() : "";
            }
          ),
          exampleKorean: grammarItem.grammar_examples.map(
            (example: { example: string }) => {
              const parts = example.example.split("<br>");
              return parts[1] ? parts[1].trim() : ""; // parts[1]이 undefined 일 수 있으므로 확인
            }
          ),
          meaning: grammarItem.meaning.replace(/<br>/g, `\n`),
        }));

        setN3(formattedDataN3);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };
    getSetData();
  }, []);

  useEffect(() => {
    console.log("setN111111::", N1);
  }, [N1]);

  // N1 N2 N3 선택
  const handleSelectGrade = (grade: string) => {
    setSelectedGrade(grade);
    console.log(grade);
  };

  // 문법 항목 클릭 핸들러
  const handleGrammarClick = (grammar: GrammarData) => {
    setSelectedGrammar(grammar);
    setIsModalOpen(true);
  };

  //////////////////////////애니메이션 관련/////////////////////

  // 문법 요소들이 순차적으로 나오는 애니메이션
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.07,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  const ModalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // 각 요소마다 다른 지연 시간을 설정합니다.
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  const modalOpenVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  // 모달 오픈 시 뒤의 상호작용 비활성화
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}

      <div className={styles.top_name_container}>
        <p className={styles.top_name_text}>Grammer</p>
      </div>

      <div className={styles.list_container}>
        <div className={styles.grade_container}>
          <div className={styles.select_grade_wrap}>
            {["N1 문법", "N2 문법", "N3 문법"].map((grade, index) => (
              <motion.div
                key={index}
                onClick={() => handleSelectGrade(grade)}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
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

        <motion.div className={styles.grammar_list_wrap}>
          {selectedGrade === "N1 문법" &&
            N1.map((grammarItem, index) => (
              <motion.div
                key={grammarItem.id}
                custom={Math.floor(index / 8)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGrammarClick(grammarItem)}
                className={styles.grammar_list_items}
              >
                <p className={styles.grammar_name}>{grammarItem.grammar}</p>
              </motion.div>
            ))}

          {selectedGrade === "N2 문법" &&
            N2.map((grammarItem, index) => (
              <motion.div
                key={grammarItem.id}
                custom={Math.floor(index / 8)} //
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGrammarClick(grammarItem)}
                className={styles.grammar_list_items}
              >
                <p className={styles.grammar_name}>{grammarItem.grammar}</p>
              </motion.div>
            ))}

          {selectedGrade === "N3 문법" &&
            N3.map((grammarItem, index) => (
              <motion.div
                key={grammarItem.id}
                custom={Math.floor(index / 8)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGrammarClick(grammarItem)}
                className={styles.grammar_list_items}
              >
                <p className={styles.grammar_name}>{grammarItem.grammar}</p>
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/*////////////// Modal //////////////////*/}
      <AnimatePresence>
        {isModalOpen && selectedGrammar && (
          <>
            <div
              onClick={() => setIsModalOpen(false)}
              className={styles.overlay}
            ></div>
            <motion.div
              variants={modalOpenVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.modal_container}
            >
              <MdCancel
                onClick={() => setIsModalOpen(false)}
                className={styles.cancel_icon}
              />
              <motion.div
                variants={ModalVariants}
                custom={0}
                initial="hidden"
                animate="visible"
                className={styles.grammer_wrap}
              >
                <p>{selectedGrammar.grammar}</p>
              </motion.div>

              <motion.div
                variants={ModalVariants}
                custom={1}
                initial="hidden"
                animate="visible"
                className={styles.text_wrap}
              >
                <p className={styles.top_text}>
                  <IoBookSharp className={styles.icons} />
                  의미
                </p>
                <p style={{ whiteSpace: "pre-wrap" }} className={styles.text}>
                  {selectedGrammar.meaning}
                </p>
              </motion.div>

              <motion.div
                variants={ModalVariants}
                custom={2}
                initial="hidden"
                animate="visible"
                className={styles.text_wrap}
              >
                <p className={styles.top_text}>
                  <LuBringToFront className={styles.icons} />
                  접속
                </p>
                <p style={{ whiteSpace: "pre-wrap" }} className={styles.text}>
                  {selectedGrammar.conjunction}
                </p>
              </motion.div>

              <motion.div
                variants={ModalVariants}
                custom={3}
                initial="hidden"
                animate="visible"
                className={styles.text_wrap}
              >
                <p className={styles.top_text}>
                  <FaBook className={styles.icons} />
                  설명
                </p>
                <p style={{ whiteSpace: "pre-wrap" }} className={styles.text}>
                  {selectedGrammar.explain}
                </p>
              </motion.div>

              <motion.div
                variants={ModalVariants}
                custom={4}
                initial="hidden"
                animate="visible"
                className={styles.text_wrap}
              >
                <p className={styles.top_text}>
                  <BsFileText className={styles.icons} />
                  예문
                </p>
                {selectedGrammar.exampleKanji.map((example, index) => (
                  <div key={index} className={styles.example_wrap}>
                    <p className={styles.example_text}>{example}</p>
                    <p className={styles.example_mean}>
                      {selectedGrammar.exampleKorean[index]}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrammarPage;
