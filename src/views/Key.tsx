
import React from 'react';
import styles from "../css/Typing.module.css";

interface KeyProps {
  label: string;
  isPressed: boolean;
  code: string;
  onKeyPress: (key: string) => void;
}

const Key: React.FC<KeyProps> = ({ label, isPressed, onKeyPress }) => {
  const keyClass = isPressed ? `${styles.key} ${styles.pressed}` : styles.key;

  return (
    <div
      className={keyClass}
      onClick={() => onKeyPress(label)}
    >
      {label}
    </div>
  );
};

export default Key;




