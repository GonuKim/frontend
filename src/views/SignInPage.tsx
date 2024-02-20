import React from 'react';
import Navbar from "../components/Navbar"
import logo from "../img/tamago.png";
import styles from "../css/SignIn.module.css"


const SignIn = () => {
    return (
    <div className={styles.wrap}>
      <Navbar />
    
      <div className={styles.main_wrap}>
    
        <div className={styles.textLogin}>
            <h1>로그인</h1>
        </div>

        <div className={styles.textContainer}>
  
        <div className={styles.h2}>
          <img src={logo} alt="" />
        </div>
          <h2 className={styles.h2}>
            이메일
          </h2>
        <div>
           <input type="email" className={styles.input} placeholder="이메일" />
        </div>
  
          <h2 className={styles.h2}>
            비밀번호
          </h2>
          <div>
            <input type="password" className={styles.input} placeholder="비밀번호" />
        </div>
  
      </div>
  
        <div>
          <button className={styles.circle}>로그인</button>
        </div>
  
      </div>
    </div>
    );
  };
  export default SignIn;