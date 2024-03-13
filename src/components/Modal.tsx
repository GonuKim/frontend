import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "../css/modal.module.css";
import instance from "../api/axios";
import axios from "axios";

interface ModalProps {
  closeModal: () => void;
}

const Modal: React.FC<ModalProps & { type: string }> = ({
  closeModal,
  type,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]); // 첫 번째 파일만 선택
      event.dataTransfer.clearData();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  // 조건부로 accept 속성 값 설정
  const getFileAcceptType = () => {
    if (type === "OCR") {
      return ".png, .jpg, .jpeg";
    } else if (type === "EXCEL") {
      return ".xls, .xlsx";
    }
    return "";
  };

  const sendExcelData = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken && file) {
      const formData = new FormData();
      formData.append("excel", file);
      try {
        console.log("excel token", accessToken);
        const response = await axios.post(
          "http://localhost:8000/api/vocabularyNote/export",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("error:", error);
      }
    }
  };

  const sendOCRData = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken && file) {
      const formData = new FormData();
      formData.append("image", file);
      console.log("token", accessToken);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        if (value instanceof File) {
          console.log(`File name: ${value.name}`);
          console.log(`File type: ${value.type}`);
          console.log(`File size: ${value.size} bytes`);
        }
      }

      try {
        const response = await instance.post("/api/ocr", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error("error:", error);
      }
    }
  };

  const haldleConfirm = async () => {
    if (type === "EXCEL") {
      await sendExcelData();
    } else if (type === "OCR") {
      await sendOCRData();
    }
    closeModal;
  };

  return (
    <div
      className={styles.modal_background}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_content}>
          {type === "OCR" && (
            <div className={styles.top_text_container}>
              <h3 className={styles.top_text}>OCR로 단어입력</h3>
              <p>
                이미지를 통하여 단어를 입력할 수 있습니다. ( *PNG, JPG 등
                이미지파일만 가능 )
              </p>
            </div>
          )}
          {type === "EXCEL" && (
            <div className={styles.top_text_container}>
              <h3 className={styles.top_text}>EXCEL로 단어입력</h3>
              <p>
                EXCEL 파일을 통하여 단어를 입력할 수 있습니다. <br></br>( *EXCEL
                파일 형식은 한자, 가나, 의미 순을 반드시 지켜주세요! )
              </p>
            </div>
          )}

          <label className={styles.upload_box}>
            <input
              className={styles.file}
              type="file"
              accept={getFileAcceptType()}
              onChange={handleFileChange}
            />
            <IoCloudUploadOutline className={styles.upload_icon} />
            <p className={styles.upload_msg}>
              클릭 혹은 파일을 이곳에 드롭하세요.
            </p>
            {file && <p className={styles.filename}>{file.name}</p>}
          </label>
          <div className={styles.btn_container}>
            <button onClick={closeModal}>닫기</button>
            <button onClick={haldleConfirm}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
