import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "../css/MemorizePage.module.css";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BsEmojiSunglassesFill } from "react-icons/bs";
import { BsFillEmojiTearFill } from "react-icons/bs";
import { motion, useMotionValue, useTransform } from "framer-motion";
interface Word {
  kanji: string;
  meaning: string;
  gana: string;
}

const MemorizePage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { words } = location.state as { words: Word[] };
  const [kanjiStyle, setKanjiStyle] = useState({});
  const { title } = location.state as { title: string };
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [animateX, setAnimateX] = useState<number | string>("0%");
  const y = useMotionValue(0);
  const opacity = useTransform(y, [70, 0], [0, 1]);
  const top = useTransform(y, [0, 100], ["0%", "100%"]);
  const [showDetails, setShowDetails] = useState(false);
  const [correctButtonClicked, setCorrectButtonClicked] =
    useState<boolean>(false);
  const [wrongButtonClicked, setWrongButtonClicked] = useState<boolean>(false);

  useEffect(() => {
    console.log(words);
    console.log("title::", title);
  }, [words, title]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      setShowDetails(true); // 상세 정보 표시 상태를 변경
      y.set(100); // 커튼을 최대치로 내림
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDetails]);

  // 이제 알아요 버튼 눌렀을 때 애니메이션
  const correctNextWord = () => {
    setKanjiStyle({ color: "#006fff", scale: 1.2 });
    setCorrectButtonClicked(true);

    setTimeout(() => {
      setAnimateX("-100vw");
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) =>
            prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex // 단어를 다음 단어로 변경
        );
        setAnimateX(0);
        setShowDetails(false); // 상세 정보 표시 상태 초기화
        y.set(0);
        setCorrectButtonClicked(false);
        setKanjiStyle({ color: "black", scale: 1 });
      }, 500); // 카드가 넘어가는 애니메이션 지속 시간
    }, 600); // 버튼 애니메이션 지속 시간
  };

  // 모르겠어요 버튼 눌렀을 때 애니메이션
  const wrongNextWord = () => {
    setWrongButtonClicked(true);

    setTimeout(() => {
      setAnimateX("-100vw");
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) =>
            prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex // 단어를 다음 단어로 변경
        );
        setAnimateX(0);
        setShowDetails(false); // 상세 정보 표시 상태 초기화
        y.set(0);
        setWrongButtonClicked(false);
      }, 500); // 카드가 넘어가는 애니메이션 지속 시간
    }, 200); // 버튼 애니메이션 지속 시간
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.info_bar_container}>
        <div className={styles.exit_btn_container}>
          <Link to={`/set/${id}`}>
            <button>
              <FaCircleArrowLeft className={styles.exit_icon} />
              학습 종료
            </button>
          </Link>
        </div>
        <div className={styles.title_container}>
          <p>{title}</p>
        </div>
      </div>

      <div className={styles.item_main_wrap}>
        <div className={styles.card_and_next_btn_wrap}>
          <motion.div
            animate={{ x: animateX }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={styles.card_container}
          >
            <div className={styles.top_wrap}>
              <motion.p
                style={kanjiStyle}
                animate={kanjiStyle}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  duration: 0.2,
                }}
              >
                {words[currentIndex].kanji}
              </motion.p>
            </div>
            <motion.div className={styles.bottom_wrap}>
              <p>가나: {words[currentIndex].gana}</p>
              <p>의미: {words[currentIndex].meaning}</p>
              <motion.div
                style={{
                  y,
                  top,
                  opacity: showDetails ? 1 : opacity,
                }}
                drag="y"
                dragElastic={{ top: 0, bottom: 0.4 }}
                dragConstraints={{ top: 0, bottom: 0 }}
                className={styles.bottom_wrap_curtain}
              >
                <p className={styles.curtain_text}>
                  스페이스를 누르거나 마우스로 내려서
                  <br />
                  의미를 확인할 수 있어요!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className={styles.next_btn_container}></div>
        </div>
        <div className={styles.is_know_container}>
          <motion.button
            animate={{ scale: correctButtonClicked ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => correctNextWord()}
          >
            {correctButtonClicked ? "잘했어요!" : "알고 있어요!"}
            <BsEmojiSunglassesFill className={styles.happy_emoji} />
          </motion.button>
          <motion.button
            animate={{ scale: wrongButtonClicked ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => wrongNextWord()}
          >
            {wrongButtonClicked ? "괜찮아요!" : "모르겠어요"}
            <BsFillEmojiTearFill className={styles.tear_emoji} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MemorizePage;
