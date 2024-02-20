import React, { useEffect, useRef } from 'react';
import Navbar from "../components/Navbar"
import styles from "../css/SignUp.module.css"
import logo from "../img/tamago.png";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";




const SignUp = () => {

  const datePickerRef = useRef(null); 

  useEffect(() => {
    // datePickerRef가 정의된 후에 flatpickr 함수를 호출하도록 변경
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        dateFormat: "Y-m-d", 
        locale: "ko", 
        maxDate: "today" 
      });
    }
  }, [datePickerRef]);

  return (
    <div className={styles.all_warp}>
 <Navbar />

 <div className={styles.wrap}>
   
  
    <div className={styles.main_wrap}>
     
    

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

        
        <h2 className={styles.h2}>
          비밀번호 확인
        </h2>
        <div>
        <input type="password check" className={styles.input} placeholder="비밀번호 확인" />
        </div>

        <h2 className={styles.h2}>
          닉네임
        </h2>
        <div>
        <input type="nickname" className={styles.input} placeholder="닉네임" />
        </div>  

        <h2 className={styles.h2}>
          생년월일
        </h2>
         <div>
          <input ref={datePickerRef} type="text" className={styles.input} placeholder="생년월일 선택" />
        </div>    

        <h2 className={styles.h2}>
          휴대전화 ( '-' 제외)
        </h2>
        <div>
        <input type="nickname" className={styles.input} placeholder="휴대전화" />
        </div>  
        <div>
        <button className={styles.circle}>가입하기</button>
      </div>
      </div>


    </div>
  </div>
    </div>
);
};
export default SignUp;