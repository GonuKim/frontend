import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import styles from "../css/SignUp.module.css";
import logo from "../img/tamago.png";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    birthday: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    nickname: "",
    phone: "",
    birthday: "",
  });
  

  useEffect(() => {
    const datePicker = flatpickr("#datepicker", {
      dateFormat: "Y-m-d",
      locale: "ko",
      maxDate: "today",
      onChange: function (selectedDates, dateStr, instance) {
        setFormData((prevState) => ({
          ...prevState,
          birthday: dateStr, // 선택한 날짜를 formData의 birthday 필드에 저장합니다.
        }));
        validate();
      },
    });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validate();
  };
  const validate = () => {
    let errors = {
      email: "",
      password: "",
      password_confirmation: "",
      nickname: "",
      phone: "",
      birthday: "",
    };
    
    if (!formData.email) {
      errors.email = "이메일은 필수입니다.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "유효한 이메일 주소를 입력하세요.";
    }
    if (!formData.password) {
      errors.password = "비밀번호는 필수입니다.";
    } else if (formData.password.length < 6) {
      errors.password = "비밀번호는 6자 이상이어야 합니다.";
    }
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.nickname) {
      errors.nickname = "닉네임은 필수입니다.";
    }
    if (!formData.phone) {
      errors.phone = "휴대전화 번호는 필수입니다.";
    }
    if (!formData.birthday) {
      errors.birthday = "생년월일을 선택하세요.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const customAxios = axios.create({
    baseURL: "http://localhost:8000/",
    withXSRFToken: true,
    withCredentials: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await customAxios.post("/api/register", formData);
      console.log(response);

      // 회원가입 성공 시 알람 창 띄우고 페이지 이동
      alert("회원가입이 완료되었습니다.");
      window.location.href = "/Signin"; // 이동할 페이지로 변경하세요
    } catch (error) {
      console.error("회원 가입 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.all_warp}>
      <div className={styles.wrap}>
        <div className={styles.main_wrap}>
          <div className={styles.textContainer}>
            <div className={styles.h2}>
              <img src={logo} alt="" />
            </div>
            <form onSubmit={handleSubmit}>
              <h2 className={styles.h2}>이메일</h2>
              <div>
                <input
                  type="email"
                  className={styles.inputForm}
                  placeholder="이메일"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                 {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
              </div>

              <h2 className={styles.h2}>비밀번호</h2>
              <div>
                <input
                  type="password"
                  className={styles.inputForm}
                  placeholder="비밀번호"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
              </div>

              <h2 className={styles.h2}>비밀번호 확인</h2>
              <div>
                <input
                  type="password"
                  className={styles.inputForm}
                  placeholder="비밀번호 확인"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                />
                {formErrors.password_confirmation && <p style={{ color: "red" }}>{formErrors.password_confirmation}</p>}
              </div>

              <h2 className={styles.h2}>닉네임</h2>
              <div>
                <input
                  type="text"
                  className={styles.inputForm}
                  placeholder="닉네임"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                />
                 {formErrors.nickname && <p style={{ color: "red" }}>{formErrors.nickname}</p>}
              </div>

              <h2 className={styles.h2}>생년월일</h2>
              <div className="flatpickr">
                <input
                  type="date"
                  id="datepicker"
                  className={styles.inputForm}
                  placeholder="생년월일 선택"
                  name="birthday"
                />
                {formErrors.birthday && <p style={{ color: "red" }}>{formErrors.birthday}</p>}
              </div>

              <h2 className={styles.h2}>휴대전화 ( '-' 제외)</h2>
              <div>
                <input
                  type="text"
                  className={styles.inputForm}
                  placeholder="휴대전화"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                 {formErrors.phone && <p style={{ color: "red" }}>{formErrors.phone}</p>}
              </div>

              <div>
                <button className={styles.circle}>가입하기</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;