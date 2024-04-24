// import React, { useEffect, useState } from "react";
// import instance from "../api/axios";
// import styles from "../css/FlipWordPage.module.css";
// import flipcard from "../img/flipcard.png";
// import { motion } from "framer-motion";
// // import FlipWordModalPage from "../components/FlipWordModalPage";

// interface Card {
//   id: string;
//   content: string;
//   type: "kanji" | "meaning";
//   matchId: string; // 매칭되는 카드의 ID
// }

// const FlipWordPage: React.FC = () => {
//   const [cards, setCards] = useState<Card[]>([]);
//   const [flippedCards, setFlippedCards] = useState<string[]>([]);
//   const [matchedCards, setMatchedCards] = useState<string[]>([]);
//   const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
//   const [inputModal, setInputModal] = useState<boolean>(false);

//   useEffect(() => {
//     fetchWords();
//   }, []);

//   const fetchWords = async () => {
//     const accessToken = sessionStorage.getItem("accessToken");
//     try {
//       const response = await instance.get("api/vocabularyNote", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       const data = response.data.notes;
//       const kanji: string[] = JSON.parse(data[0].kanji) || [];
//       const meaning: string[] = JSON.parse(data[0].meaning) || [];

//       const tempCards: Card[] = [];
//       // 총 n쌍만 생성
//       for (let i = 0; i < 6; i++) {
//         const kanjiId = `kanji-${i}`;
//         const meaningId = `meaning-${i}`;
//         tempCards.push({
//           id: kanjiId,
//           content: kanji[i],
//           type: "kanji",
//           matchId: meaningId,
//         });
//         tempCards.push({
//           id: meaningId,
//           content: meaning[i],
//           type: "meaning",
//           matchId: kanjiId,
//         });
//       }

//       setCards(shuffleCards(tempCards)); // 카드를 섞기
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // 카드를 섞는 함수 (Fisher-Yates Shuffle)
//   const shuffleCards = (array: Card[]) => {
//     let currentIndex = array.length,
//       randomIndex;
//     while (currentIndex !== 0) {
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
//       [array[currentIndex], array[randomIndex]] = [
//         array[randomIndex],
//         array[currentIndex],
//       ];
//     }
//     return array;
//   };

//   const handleCardClick = (id: string) => {
//     if (
//       flippedCards.includes(id) ||
//       matchedCards.includes(id) ||
//       flippedCards.length === 2
//     ) {
//       return; // 이미 선택된 카드 무시
//     }

//     const newFlippedCards = [...flippedCards, id];
//     setFlippedCards(newFlippedCards);

//     if (newFlippedCards.length === 2) {
//       const firstCard = cards.find((card) => card.id === newFlippedCards[0]);
//       const secondCard = cards.find((card) => card.id === newFlippedCards[1]);
//       if (firstCard && secondCard && firstCard.matchId === secondCard.id) {
//         setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
//         setFlippedCards([]);
//       } else {
//         setTimeout(() => setFlippedCards([]), 1000);
//       }
//     }
//   };

//   const inputModalHandler = (grade: string) => {
//     if (grade === "유저 문장") {
//       setInputModal(true);
//     }
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.whole_container}>
//         <div className={styles.list_container}>
//           <div className={styles.grade_container}>
//             <div className={styles.select_grade_wrap}>
//               {["N1", "N2", "N3", "N4", "N5", "유저 단어"].map(
//                 (grade, index) => (
//                   <motion.div
//                     key={index}
//                     onClick={() => inputModalHandler(grade)}
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     style={{
//                       scale: selectedGrade === grade ? 1.1 : 1,
//                       backgroundColor: selectedGrade === grade ? "#fafafa" : "",
//                     }}
//                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                     className={styles.grade_items}
//                   >
//                     {grade}
//                   </motion.div>
//                 )
//               )}
//             </div>
//           </div>
//         </div>

//         <ul className={styles.cards}>
//           {cards.map((card, index) => (
//             <li
//               key={index}
//               className={`${styles.card} ${
//                 flippedCards.includes(card.id) || matchedCards.includes(card.id)
//                   ? styles.flip
//                   : ""
//               }`}
//               onClick={() => handleCardClick(card.id)}
//             >
//               <div className={`${styles.view} ${styles.front}`}>
//                 <img src={flipcard} alt="flipcard" />
//               </div>
//               <div className={`${styles.view} ${styles.back}`}>
//                 {card.content}
//               </div>
//             </li>
//           ))}
//         </ul>
//         {/*
//         {inputModal ? <FlipWordModalPage data={setInputModal} /> : null} */}
//       </div>
//     </div>
//   );
// };

// export default FlipWordPage;

import React, { useEffect, useState } from "react";
import instance from "../api/axios";
import styles from "../css/FlipWordPage.module.css";
import flipcard from "../img/flipcard.png";
import flipSound from "../sounds/flip-sound.mp3_[cut_1sec]_[cut_1sec].mp3"; // 뒤집을 때의 효과음
import matchSound from "../sounds/successflip.mp3"; // 매칭 성공 시의 효과음
import { motion } from "framer-motion";

interface Card {
  id: string;
  content: string;
  type: "kanji" | "meaning";
  matchId: string;
}

const FlipWordPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [inputModal, setInputModal] = useState<boolean>(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    try {
      const response = await instance.get("api/vocabularyNote", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data.notes;
      const kanji: string[] = JSON.parse(data[0].kanji) || [];
      const meaning: string[] = JSON.parse(data[0].meaning) || [];

      const tempCards: Card[] = [];
      for (let i = 0; i < 6; i++) {
        const kanjiId = `kanji-${i}`;
        const meaningId = `meaning-${i}`;
        tempCards.push({
          id: kanjiId,
          content: kanji[i],
          type: "kanji",
          matchId: meaningId,
        });
        tempCards.push({
          id: meaningId,
          content: meaning[i],
          type: "meaning",
          matchId: kanjiId,
        });
      }

      setCards(shuffleCards(tempCards));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const shuffleCards = (array: Card[]) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const handleCardClick = (id: string) => {
    if (
      flippedCards.includes(id) ||
      matchedCards.includes(id) ||
      flippedCards.length === 2
    ) {
      return;
    }

    playSound(flipSound);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const firstCard = cards.find((card) => card.id === newFlippedCards[0]);
      const secondCard = cards.find((card) => card.id === newFlippedCards[1]);
      if (firstCard && secondCard && firstCard.matchId === secondCard.id) {
        playSound(matchSound);
        setMatchedCards((prev) => [...prev, firstCard.id, secondCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const inputModalHandler = (grade: string) => {
    if (grade === "유저 문장") {
      setInputModal(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.whole_container}>
        <div className={styles.list_container}>
          <div className={styles.grade_container}>
            <div className={styles.select_grade_wrap}>
              {["N1", "N2", "N3", "N4", "N5", "유저 단어"].map(
                (grade, index) => (
                  <motion.div
                    key={index}
                    onClick={() => inputModalHandler(grade)}
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
                )
              )}
            </div>
          </div>
        </div>

        <ul className={styles.cards}>
          {cards.map((card, index) => (
            <li
              key={index}
              className={`${styles.card} ${
                flippedCards.includes(card.id) || matchedCards.includes(card.id)
                  ? styles.flip
                  : ""
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={`${styles.view} ${styles.front}`}>
                <img src={flipcard} alt="flipcard" />
              </div>
              <div className={`${styles.view} ${styles.back}`}>
                {card.content}
              </div>
            </li>
          ))}
        </ul>
        {/* {inputModal ? <FlipWordModalPage data={setInputModal} /> : null} */}
      </div>
    </div>
  );
};

export default FlipWordPage;
