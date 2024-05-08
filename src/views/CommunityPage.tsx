import styles from "../css/CommunityPage.module.css";
import { FcLike } from "react-icons/fc";
import React, { useState, ChangeEvent, useEffect } from "react";
import instance from "../api/axios";
import axios from "axios";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  meaning: string[];
  count: number;
}

const CommunityPage: React.FC = () => {
  const [sort, setSort] = useState<"recent" | "recommended">("recent");
  const [posts, setPosts] = React.useState<Post[]>([]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as "recent" | "recommended");
    // 선택된 옵션에 따라 데이터를 정렬하거나 필터링하는 로직을 추가할 수 있습니다.
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/api/vocabularyNote/public/notes");
        console.log("getData:", response.data);

        const notes = [...response.data.notes];
        const receivedPosts: Post[] = notes.map((post: Post) => ({
          id: post.id,
          title: post.title,
          meaning: post.meaning,
          count: post.meaning.length,
        }));
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

  return (
    <div className={styles.main_container}>
      <div className={styles.recommend_container}>
        <div className={styles.recommend_text_container}>
          <p className={styles.recommend_text}>Recommend</p>
        </div>
        <div className={styles.recommend_item_container}>
          {posts.map((posts) => (
            <Link to={`/set/${posts.id}`} className={styles.link_style}>
              <div className={styles.recommend_items}>
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
            </Link>
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
    </div>
  );
};

export default CommunityPage;
