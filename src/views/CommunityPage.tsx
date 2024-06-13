import styles from "../css/CommunityPage.module.css";
import { FcLike } from "react-icons/fc";
import React, { useState, ChangeEvent, useEffect } from "react";
import instance from "../api/axios";
import axios from "axios";
import { Link } from "react-router-dom";

interface Word {
  kanji: string;
  meaning: string;
  gana: string;
}

interface Post {
  id: number;
  title: string;
  words: Word[];
  count: number;
}

const CommunityPage: React.FC = () => {
  const [sort, setSort] = useState<"recent" | "recommended">("recent");
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(
    null
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as "recent" | "recommended");
    // 선택된 옵션에 따라 데이터를 정렬하거나 필터링하는 로직을 추가할 수 있습니다.
  };

  const handleModal = (index: number) => {
    setSelectedPostIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/api/vocabularyNote/public/notes");
        console.log("getData:", response.data);

        const notes = [...response.data.notes];
        const receivedPosts: Post[] = notes.slice(5).map((post) => {
          const kanjiArray = JSON.parse(post.kanji);
          const meaningArray = JSON.parse(post.meaning);
          const ganaArray = JSON.parse(post.gana);

          const words = kanjiArray.map((kanji: string, i: number) => ({
            kanji,
            meaning: meaningArray[i],
            gana: ganaArray[i],
          }));

          return {
            id: post.id,
            title: post.title,
            words,
            count: meaningArray.length,
          };
        });
        setPosts(receivedPosts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error data:", error.response?.data);
          console.error("Error status:", error.response?.status);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };
    getData();
  }, []);

  useEffect(() => {
    console.log("Posts!!", posts);
  }, [posts]);

  return (
    <div className={styles.main_container}>
      <div className={styles.recommend_container}>
        <div className={styles.recommend_text_container}>
          <p className={styles.recommend_text}>Recommend</p>
        </div>
        <div className={styles.recommend_item_container}>
          {posts.map((posts, index) => (
            <div key={posts.id} className={styles.link_style}>
              <div
                onClick={() => handleModal(index)}
                className={styles.recommend_items}
              >
                <div className={styles.items_texts}>
                  <p>{posts.title}</p>
                  <p>{posts.count}</p>
                </div>

                <div className={styles.items_like}>
                  <p>
                    <FcLike />
                    23
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.all_container}>
        <div className={styles.all_text_container}>
          <p>ALL</p>
          <div className={styles.sort_container}>
            <select id="sort-select" value={sort} onChange={handleChange}>
              <option value="recent">최신순</option>
              <option value="recommended">추천순</option>
            </select>
          </div>
        </div>

        <div className={styles.all_item_container}>
          <div className={styles.recommend_items}>
            <div className={styles.items_texts}>
              <p>JLPT N2 단어장</p>
              <p>32카드</p>
            </div>

            <div className={styles.items_like}>
              <p>
                <FcLike />
                23
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*////////////// Modal //////////////////*/}

      {isModalOpen && selectedPostIndex !== null && (
        <div className={styles.modal_container}>
          <div className={styles.title_wrap}>
            {posts[selectedPostIndex].title}
          </div>
          <div className={styles.card_main_container}>
            {posts[selectedPostIndex].words.map((word, index) => (
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

          <div className={styles.card_main_container}>
            <div className={styles.card_wrap}>
              <div className={styles.kanji_wrap}>
                <p className={styles.text_kanji}>한자</p>
              </div>

              <div className={styles.mean_gana_wrap}>
                <p className={styles.text_mean}>의미: 뜻</p>
                <p className={styles.text_gana}>가나: 가나</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
