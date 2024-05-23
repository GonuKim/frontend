import React, { useEffect, useState } from "react";
import styles from "../css/SetTypingPage.module.css";
import instance from "../api/axios";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";

interface Get {
  id: number;
  updated_at: string;
  title: string;
}

interface AdminGet {
  id: number;
  apiId: string;
  updated_at: string;
  title: string;
}

const SetTypingPage: React.FC = () => {
  const [gets, setGets] = React.useState<Get[]>([]);
  const [adminGets, setAdminGets] = React.useState<AdminGet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getListData = async () => {
      setLoading(true);

      const accessToken = sessionStorage.getItem("accessToken");
      try {
        const response = await instance.get(
          "/api/typing/getSentences",

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("response.data.data:::", response.data);

        // API 응답에서 게시글 배열에 접근하여 상태 업데이트
        if (
          response.data
        ) {
          const myNotes = [...response.data];
          const receivedGets: Get[] = myNotes.map((get: Get) => ({
            id: get.id,
            updated_at: get.updated_at,
            title: get.title,
          }));
          console.log("receivedGets:::", receivedGets)
          // posts 상태 업데이트
          setGets(receivedGets);
          //response.data.adminNotes[0].title

        
          console.log("adminGets", adminGets);
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

  // const deleteSet = async (id: number) => {
  //   const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

  //   if (isConfirmed) {
  //     try {
  //       const response = await instance.delete(`/api/sentenceNotes/${id}`);
  //       console.log("response.data.data:::", response.data);
  //       setPosts(posts.filter((post) => post.id !== id));
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error("Error message:", error.message);

  //         if (axios.isAxiosError(error)) {
  //           console.error("Error data:", error.response?.data);
  //           console.error("Error status:", error.response?.status);
  //         }
  //       } else {
  //         console.error("An unexpected error occurred");
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    console.log("Updated gets:", gets);
  }, [gets]); // posts 상태가 변경될 때마다 실행됩니다.

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}
      <div className={styles.top_name_wrap}>
        <div className={styles.top_name_container}>
          <h3>타자 연습</h3>
        </div>
      </div>
      
     {/* <div className={styles.user_set_wrap}>
       <div className={styles.user_top_title}>유저 단어장</div>
      </div>
       */}
       
      <div className={styles.set_list_wrap}>
        <div className={styles.article_container}>
          <p>ID</p> <p>세트 이름</p>
          <p>만든 시간</p>
        </div>

        <div className={styles.my_set_wrap}>
          {gets.map((get, index) => (
            <div key={index} className={styles.set_info_container}>
              <Link
                to={`/Typing/${get.id}`}
                className={styles.link_style}
              >
                <p>#{index + 1}</p>
                <p>{get.title}</p>
                <p>{new Date(get.updated_at).toLocaleDateString()}</p>
              </Link>
              {/* <div className={styles.btn_container}>
                <Link to={`/EditWord/${post.id}`}>
                  <button className={styles.modify_btn}>수정</button>
                </Link>

                <button
                  className={styles.delete_btn}
                  onClick={() => deleteSet(post.id)}
                >
                  삭제
                </button>
              </div> */}
            </div>
          ))}
        </div>



        <div className={styles.admin_set_wrap}>
          <div className={styles.admin_top_title}>기본 문장</div>
          {adminGets.map((get, index) => (
            <div key={index} className={styles.set_info_container}>
              <Link
                to={`/Typing/${get.id}`}
                state={{ id: get.apiId }}
                className={styles.link_style}
              >
                <p>#{index + 1}</p>
                <p>{get.title}</p>
                <p>{new Date(get.updated_at).toLocaleDateString()}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetTypingPage;