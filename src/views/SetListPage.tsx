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
  const [adminPosts, setAdminPosts] = React.useState<Post[]>([]);
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
        console.log("response.data.data:::", response.data);

        // API 응답에서 게시글 배열에 접근하여 상태 업데이트
        if (
          response.data.status === "Success" &&
          Array.isArray(response.data.notes) &&
          Array.isArray(response.data.adminNotes)
        ) {
          const myNotes = [...response.data.notes];
          const receivedPosts: Post[] = myNotes.map((post: Post) => ({
            id: post.id,
            updated_at: post.updated_at,
            title: post.title,
          }));
          // posts 상태 업데이트
          setPosts(receivedPosts);
          //response.data.adminNotes[0].title
          const testData = response.data.adminNotes[0].title;
          console.log("testData", testData);
          const adminNotes = [...response.data.adminNotes.slice(0, 5)];
          const receivedAdminPosts: Post[] = adminNotes.map((post: Post) => ({
            id: post.id,
            updated_at: post.updated_at,
            title: JSON.parse(post.title),
          }));
          setAdminPosts(receivedAdminPosts);
          console.log(adminPosts);
        } else {
          // 데이터가 유효하지 않은 경우 빈 배열로 초기화
          setPosts([]);
          console.log("posts::", posts); // 현재 posts 상태 로깅 (동기적으로 로깅되지 않을 수 있음)
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

  const deleteSet = async (id: number) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (isConfirmed) {
      try {
        const response = await instance.delete(`/api/vocabularyNote/${id}`);
        console.log("response.data.data:::", response.data);
        setPosts(posts.filter((post) => post.id !== id));
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
    }
  };

  useEffect(() => {
    console.log("Updated posts:", posts);
  }, [posts]); // posts 상태가 변경될 때마다 실행됩니다.

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}
      <div className={styles.top_name_wrap}>
        <div className={styles.top_name_container}>
          <h3>내 단어장</h3>
        </div>
      </div>

      <div className={styles.set_list_wrap}>
        <div className={styles.article_container}>
          <p>ID</p> <p>세트 이름</p>
          <p>만든 시간</p>
        </div>
        <div className={styles.admin_set_wrap}></div>

        <div className={styles.my_set_wrap}>
          {posts.map((post, index) => (
            <div key={index} className={styles.set_info_container}>
              <Link to={`/set/${post.id}`} className={styles.link_style}>
                <p>#{index + 1}</p>
                <p>{post.title}</p>
                <p>{new Date(post.updated_at).toLocaleDateString()}</p>
              </Link>
              <div className={styles.btn_container}>
                <Link to={`/EditWord/${post.id}`}>
                  <button className={styles.modify_btn}>수정</button>
                </Link>

                <button
                  className={styles.delete_btn}
                  onClick={() => deleteSet(post.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetListPage;
