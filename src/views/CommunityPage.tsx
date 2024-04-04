import styles from "../css/CommunityPage.module.css";
import { FcLike } from "react-icons/fc";
import React, { useState, ChangeEvent } from "react";

const CommunityPage: React.FC = () => {
  const [sort, setSort] = useState<"recent" | "recommended">("recent");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as "recent" | "recommended");
    // 선택된 옵션에 따라 데이터를 정렬하거나 필터링하는 로직을 추가할 수 있습니다.
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.recommend_container}>
        <div className={styles.recommend_text_container}>
          <p className={styles.recommend_text}>Recommend</p>
        </div>
        <div className={styles.recommend_item_container}>
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
