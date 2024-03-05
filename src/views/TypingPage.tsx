import React, { useState } from 'react';
import styles from "../css/Typing.module.css";

const TypingPage =()=> {
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    if (!pressedKeys.includes(key)) {
      setPressedKeys(prevKeys => [...prevKeys, key]);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    setPressedKeys(prevKeys => prevKeys.filter(k => k !== key));
  };
  
  return (
     <div className={styles.pageContainer}
      tabIndex={0} 
      onKeyDown={handleKeyDown} 
      onKeyUp={handleKeyUp}>
        
        <div className={styles.main_wrap}>
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((key, keyIndex) => (
              <button 
                key={keyIndex} 
                className={`${styles.key} ${pressedKeys.includes(key) ? styles.keyPressed : ''}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypingPage;