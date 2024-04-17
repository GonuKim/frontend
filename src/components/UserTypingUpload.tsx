import React, { useState } from "react";
import { uploadUserText } from "../api/typinguser"; // 유저 문장 등록 API 함수

import styles from "../css/UserTypingUpload.module.css";

const UserTypingUpload: React.FC<{ data: (value: boolean) => void }> = ({
  data,
}) => {
  const [inputText, setInputText] = useState<string>("");

  // 텍스트 입력 시 실행되는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputText(text);
  };

  // 텍스트 업로드 시 실행되는 함수
  const handleTextUpload = async () => {
    if (!inputText) {
      console.error("No text entered");
      return;
    }

    try {
      const uploadResponse = await uploadUserText(inputText); // 텍스트 업로드
      console.log("Text uploaded successfully:", uploadResponse);
      // 업로드 성공 시 추가적인 처리 가능
    } catch (error) {
      console.error("Failed to upload text:", error);
    }
  };

  return (
    <div className={styles.main_container}>
      {/* 모달 */}

      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="텍스트를 입력 해주세요."
          />
          {/* 텍스트 업로드 버튼 */}
          <button onClick={handleTextUpload}>업로드</button>
          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              data(false);
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypingUpload;
