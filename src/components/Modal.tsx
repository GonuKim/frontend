import React from "react";
import styles from "../css/modal.module.css";
interface ModalProps {
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ closeModal }) => {
  return (
    <div className={styles.modal_background}>
      <div className={styles.modal_container}>
        <div className={styles.modal_content}>
          {/* 모달 콘텐츠 */}
          <p>여기에 모달의 내용이 들어갑니다.</p>
          <input type="file" />

          <div className={styles.btn_container}>
            <button>확인</button>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
