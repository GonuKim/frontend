import React, { useEffect, useState } from "react";
import styles from "../css/SetListpage.module.css";
import instance from "../api/axios";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";

interface Post {
  id: number;
  updated_at: string;
  title: string;
}

const SetListPage: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getListData = async () => {
      setLoading(true);

      const accessToken = sessionStorage.getItem("accessToken");
      try {
        const response = await instance.get(
          "api/vocabularyNote/",

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("response.data.data:::", response.data.data);

        // API 응답에서 게시글 배열에 접근하여 상태 업데이트
        if (
          response.data.status === "Success" &&
          Array.isArray(response.data.data.notes)
        ) {
          const receivedPosts: Post[] = response.data.data.notes.map(
            (post: Post) => ({
              id: post.id, // id 값도 포함하여 매핑
              updated_at: post.updated_at,
              title: post.title,
            })
          );
          setPosts(receivedPosts);
        } else {
          setPosts([]);
          console.log("posts::", posts);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error message:", error.message);

          if (axios.isAxiosError(error)) {
            console.error("Error data:", error.response?.data);
            console.error("Error status:", error.response?.status);
          }
        } else {
          console.error("An unexpected error occurred");
        }
      }
      setLoading(false);
    };
    getListData();
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시에만 함수가 실행되도록 합니다.

  useEffect(() => {
    console.log("Updated posts:", posts);
  }, [posts]); // posts 상태가 변경될 때마다 실행됩니다.

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}
      <div className={styles.top_name_wrap}>
        <div className={styles.top_name_container}>
          <h3>내가 만든 단어장</h3>
        </div>
        L
      </div>

      <div className={styles.set_list_wrap}>
        <div className={styles.article_container}>
          <p>ID</p> <p>세트 이름</p>
          <p>만든 시간</p>
        </div>

        {posts.map((post, index) => (
          <div key={index} className={styles.set_info_container}>
            <Link to={`/set/${post.id}`} className={styles.link_style}>
              <p>#{post.id}</p>
              <p>{post.title}</p>
              <p>{new Date(post.updated_at).toLocaleDateString()}</p>
            </Link>
            <div className={styles.btn_container}>
              <button className={styles.modify_btn}>수정</button>
              <button className={styles.delete_btn}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetListPage;
