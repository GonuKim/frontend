import React, { useEffect, useRef, useState } from "react";
import instance from "../api/axios"; // instance 를 import 하는 부분입니다.
import styles from "../css/FlipWordPage.module.css";

interface Word {
   kanji: string;
   meaning: string;
   
}

const FlipWordPage: React.FC = () => {
    const cardsRef = useRef<NodeListOf<HTMLLIElement> | null>(null);
    const cardOneRef = useRef<HTMLLIElement | null>(null);
    const cardTwoRef = useRef<HTMLLIElement | null>(null);
    const disableDeckRef = useRef(false);
    const [words, setWords] = useState<Word[]>([]);
    const [selectedCards, setSelectedCards] = useState<HTMLLIElement[]>([]);

    useEffect(() => {
        cardsRef.current = document.querySelectorAll(`.${styles.cards} li`);
    }, []);


    
    const fetchWords = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            const response = await instance.get(
                "api/vocabularyNote",
                 
                {
                    headers: {
                        "Content-Type": "application/json", 
                        Authorization: `Bearer ${accessToken}`, 
                    },
                }
            );
    
            console.log("response.data", response.data);
            const data = response.data.data;
            console.log("data::", data);
    
            const kanji: string[] = JSON.parse(data[0].kanji) || []; 
            const meaning: string[] = JSON.parse(data[0].meaning) || [];
            console.log("kanji:", kanji ,"meaning:", meaning);
            // kanji와 meaning 배열에서 null 값을 제거하고 타입을 명시합니다.
            const filteredWords: Word[] = kanji.reduce<Word[]>((acc, kanjiValue, index) => {
                const correspondingMeaning = meaning[index];
                if (kanjiValue && correspondingMeaning) { // null이 아니면 추가
                    acc.push({ kanji: kanjiValue, meaning: correspondingMeaning });
                }
                return acc;
            }, []);
    
            console.log(filteredWords);
            setWords(filteredWords);
        } catch (error) {
            
            console.error("Error:", error);
        }
    };

   useEffect(() => {
        fetchWords();
    }, []);
    

    const flipCard = (e: React.MouseEvent<HTMLLIElement>) => {
        const clickedCard = e.currentTarget;
    
        if (!clickedCard || selectedCards.length === 2 || disableDeckRef.current) {
            return;
        }
    
        clickedCard.classList.add(styles.flip);
        setSelectedCards(prev => [...prev, clickedCard]);
    
        if (selectedCards.length + 1 === 2) {
            const matchId1 = selectedCards[0].getAttribute('data-match-id');
            const matchId2 = clickedCard.getAttribute('data-match-id');
    
            if (matchId1 === matchId2) {
                console.log("Match found!");
                // 카드 일치 처리
                setSelectedCards([]);
                disableDeckRef.current = true; // 카드 일치 시 잠시 카드 선택 비활성화
            } else {
                console.log("No match.");
                // 일치하지 않는 경우, 선택된 카드 초기화 및 카드 뒤집기 처리
                setTimeout(() => {
                    selectedCards.forEach(card => card.classList.remove(styles.flip));
                    clickedCard.classList.remove(styles.flip);
                    setSelectedCards([]);
                }, 1000);
            }
        }
    };
    

    function matchCards(text1: string, text2: string) {
        if (text1 === text2) {
            cardOneRef.current = cardTwoRef.current = null;
            disableDeckRef.current = false;
        } else {
            setTimeout(() => {
                cardOneRef.current?.classList.add(styles.shake);
                cardTwoRef.current?.classList.add(styles.shake);
                // 진동 반응 추가
                navigator.vibrate(200);
            }, 400);

            setTimeout(() => {
                cardOneRef.current?.classList.remove(styles.shake, styles.flip);
                cardTwoRef.current?.classList.remove(styles.shake, styles.flip);
                cardOneRef.current = cardTwoRef.current = null;
                disableDeckRef.current = false;
            }, 1200);
        }
    }

    useEffect(() => {
        const cards = cardsRef.current;
        if (cards) {
            cards.forEach(card => {
                card.addEventListener("click", flipCard as any);
            });
        }

        return () => {
            if (cards) {
                cards.forEach(card => {
                    card.removeEventListener("click", flipCard as any);
                });
            }
        };
    }, []);

    



    return (
   <div className={styles.pageContainer}>
    <div>{}</div>
    <div className={styles.wrap__card}>
        <div className={styles.card__inner}>
            <ul className={styles.cards}>
                {words.slice(0, 16).map((word, index) => ( // 여기를 수정했습니다.
                    <li key={index} >
                        <div className={`${styles.view} ${styles.front}`}>
                            {/* 앞면에는 아무 것도 표시하지 않음 */}
                        </div>
                        <div className={`${styles.view} ${styles.back}`}>
                            {/* 일본어 단어와 한국어 의미 표시 */}
                            <div>{word.kanji}</div>
                            <div>{word.meaning}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
</div>   
);

};

export default FlipWordPage;