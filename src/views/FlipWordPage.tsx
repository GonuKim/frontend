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

    useEffect(() => {
        cardsRef.current = document.querySelectorAll(`.${styles.cards} li`);
    }, []);

    const fetchWords = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            const response = await instance.post(
                "api/vocabularyNote/index",
                {}, 
                {
                    headers: {
                        "Content-Type": "application/json", 
                        Authorization: `Bearer ${accessToken}`, 
                    },
                }
            );
            // 응답 데이터를 받아온 후 처리

            // 여러개의 단어장 중 사용자가 고른 단어장의 ID번호를 저장 후  
            // 밑의 data[i] 에서 i에 저장 후 카드를 배치해야 합니다.
            // 이거 로직은 챗지피티나 구글에 검색하면 많이 나와요
            // 단어중 null값이 포함돼있기 때문에 words에 저장할 때 ""(빈문자열)로 저장해야 합니다.
            // 그 후 key : value에서 "" : value 값인 객체는 삭제하는 작업이 필요합니다.
            // 최종적으로 words에는 "한자" : "의미"의 형태만 저장되도록 해야 합니다.
            console.log("response.data",response.data);
            const data = response.data.data;
            console.log("data::",data)
            const kanji = JSON.parse(data[8].kanji) || []; 
            const meaning = JSON.parse(data[8].meaning) || [];
            console.log(kanji, meaning);
            // 서버로부터 받아온 데이터가 Word 인터페이스와 일치하는지 확인
            setWords([
                    kanji, meaning
               ])
               console.log(words)
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    useEffect(() => {
        fetchWords();
    }, []);
    

    const flipCard = (e: React.MouseEvent<HTMLLIElement>) => {
        const clickedCard = e.currentTarget;

        if (!clickedCard || cardOneRef.current || disableDeckRef.current) {
            return;
        }

        clickedCard.classList.add(styles.flip);

        if (!cardOneRef.current) {
            cardOneRef.current = clickedCard;
        } else {
            cardTwoRef.current = clickedCard;
            disableDeckRef.current = true;

            if (cardOneRef.current && cardTwoRef.current) {
                const cardOneBack = (cardOneRef.current as HTMLElement).querySelector(`.${styles.back}`) as HTMLElement;
                const cardTwoBack = (cardTwoRef.current as HTMLElement).querySelector(`.${styles.back}`) as HTMLElement;
            
                if (cardOneBack && cardTwoBack) {
                    const cardOneText = cardOneBack.textContent || "";
                    const cardTwoText = cardTwoBack.textContent || "";
                    matchCards(cardOneText, cardTwoText);
                }
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
                    {words.map((word, index) => (
                        <li key={index}>
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
