import React, { useEffect, useState } from "react";
import instance from "../api/axios";
import styles from "../css/FlipWordPage.module.css";
import flipcard from "../img/flipcard.png";

interface Card {
  id: string;
  content: string;
  type: 'kanji' | 'meaning';
  matchId: string; // 매칭되는 카드의 ID
}

const FlipWordPage: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);

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

      const data = response.data.data.notes;
      const kanji: string[] = JSON.parse(data[0].kanji) || [];
      const meaning: string[] = JSON.parse(data[0].meaning) || [];

      const tempCards: Card[] = [];
      // 총 8쌍만 생성
      for (let i = 0; i < 6; i++) {
        const kanjiId = `kanji-${i}`;
        const meaningId = `meaning-${i}`;
        tempCards.push({ id: kanjiId, content: kanji[i], type: 'kanji', matchId: meaningId });
        tempCards.push({ id: meaningId, content: meaning[i], type: 'meaning', matchId: kanjiId });
      }

      setCards(shuffleCards(tempCards)); // 카드를 섞습니다.
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 카드를 섞는 함수 (Fisher-Yates Shuffle)
  const shuffleCards = (array: Card[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const handleCardClick = (id: string) => {
    if (flippedCards.includes(id) || matchedCards.includes(id) || flippedCards.length === 2) {
      return; // 이미 선택된 카드 무시
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);
      if (firstCard && secondCard && firstCard.matchId === secondCard.id) {
        setMatchedCards(prev => [...prev, firstCard.id, secondCard.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <ul className={styles.cards}>
        {cards.map((card, index) => (
          <li
            key={index}
            className={`${styles.card} ${flippedCards.includes(card.id) || matchedCards.includes(card.id) ? styles.flip : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={`${styles.view} ${styles.front}`}>
              {/* 앞면에는 카드 타입 표시 */}
              <img src={flipcard} alt="flipcard"/>
            </div>
            <div className={`${styles.view} ${styles.back}`}>
              {/* 뒷면에는 kanji 또는 meaning 표시 */}
              {card.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlipWordPage;
