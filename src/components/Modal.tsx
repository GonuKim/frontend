import React, { useState, useContext } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "../css/modal.module.css";
import instance from "../api/axios";
import { DataContext } from "../contexts/DataContext";
import LoadingBar from "./LoadingBar";
import axios from "axios";

interface ModalProps {
  closeModal: () => void;
}

const Modal: React.FC<ModalProps & { type: string }> = ({
  closeModal,
  type,
}) => {
  const { setParsedExcelData, setOCRData } = useContext(DataContext) || {};
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const getFileAcceptType = () => {
    if (type === "OCR") {
      return ".png, .jpg, .jpeg";
    } else if (type === "EXCEL") {
      return ".xls, .xlsx";
    }
    return "";
  };

  const sendExcelData = async () => {
    setLoading(true);
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken && file && setParsedExcelData) {
      // setParsedExcelData 존재 여부 확인
      const formData = new FormData();
      formData.append("excel", file);
      try {
        const response = await instance.post(
          "api/vocabularyNote/export",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data);
        // Excel 데이터를 전역 상태로 업데이트
        setParsedExcelData({
          gana: response.data.note.gana,
          kanji: response.data.note.kanji,
          meaning: response.data.note.meaning,
        });
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
    setLoading(false);
  };

  const sendOCRData = async () => {
    setLoading(true);
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken && file && setOCRData) {
      // setOCRData 존재 여부 확인
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await instance.post(
          "/api/vocabularyNote/ocr",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // OCR 데이터를 전역 상태로 업데이트
        console.log("reponseOcr", response);
        const jsonPart = response.data.split("<br />")[1];
        const parsedData = JSON.parse(jsonPart);
        console.log(parsedData);
        setOCRData(parsedData);
      } catch (error) {
        console.error("error:", error);
      }
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (type === "EXCEL") {
      await sendExcelData();
    } else if (type === "OCR") {
      await sendOCRData();
    }
    closeModal();
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
              클릭 혹은 파일을 이곳에 드롭하세요.{" "}
            </p>
            {loading && (
              <div className={styles.loadingContainer}>
                <LoadingBar />
              </div>
            )}

            {file && <p className={styles.filename}>{file.name}</p>}
          </label>
          <div className={styles.btn_container}>
            <button onClick={closeModal}>닫기</button>
            <button onClick={handleConfirm}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
