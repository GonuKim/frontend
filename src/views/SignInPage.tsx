import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../img/tamago.png";
import styles from "../css/SignIn.module.css";
import axios from "axios";
import socialGithub from "../img/socialgithub.png";
import socialGoogle from "../img/socialgoogle.png";
import socialKakao from "../img/socialkakao.png";
import socialNaver from "../img/socialnaver.png";
import SocialCallback from "./CallBack";
import instance from "../api/axios";

const SignIn = () => {
  const [loginUrl, setLoginUrl] = useState();
  const [provider, setProvider] = useState("");

  const customAxios = axios.create({
    baseURL:
      "http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com",
    withCredentials: true,
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [user, setUser] = useState(null);

  const handle_social_login = (provider: string) => {
    axios
      .get(
        `http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com:80/api/social/${provider}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withXSRFToken: true,
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        throw new Error("Something went wrong!");
      })
      .then((data) => {
        setLoginUrl(data.url);
        setProvider(provider);
      })
      .catch((error) => {
        console.error("소셜 로그인에 실패했습니다:", error);
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validate(e);
  };

  const validate = (e: FormEvent) => {
    let errors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      errors.email = "이메일은 필수입니다.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "유효한 이메일 주소를 입력하세요.";
    }
    if (formData.password.length < 6) {
      errors.password = "비밀번호는 7자 이상이어야 합니다.";
    }
    setFormErrors(errors);
    e.preventDefault();
    // return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: FormEvent) => {
    try {
      console.log(formData);
      const response = await customAxios.post("/api/login", formData);
      console.log(response);
      console.log(response.data);

      if (response.data.message === "Login success") {
        const { access_token, refresh_token } = response.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        sessionStorage.setItem("accessToken", access_token);
        sessionStorage.setItem("refreshToken", refresh_token);

        alert("로그인에 성공했습니다.");
        window.location.href = "/Main"; // 이동할 페이지
      } else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
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
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.main_wrap}>
        <div className={styles.textContainer}>
          <div className={styles.logo_wrap}>
            <img src={logo} alt="" />
          </div>

          <h2 className={styles.h2}>아이디</h2>
          <div>
            <input
              type="text"
              className={styles.input}
              placeholder="아이디"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {formErrors.email && (
              <p style={{ color: "red" }}>{formErrors.email}</p>
            )}
          </div>

          <h2 className={styles.h2}>비밀번호</h2>
          <div>
            <input
              type="password"
              className={styles.input}
              placeholder="비밀번호"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {formErrors.password && (
            <p style={{ color: "red" }}>{formErrors.password}</p>
          )}
        </div>

        <div className={styles.btn_wrap}>
          <button className={styles.circle} onClick={handleSubmit}>
            로그인
          </button>
        </div>

        <div className={styles.social_link}>
          <div className={styles.social_text_container}>
            <p className={styles.social_text}>소셜 로그인</p>
          </div>
          <div className={styles.social_container}>
            <div className={styles.social_items}>
              <a href={loginUrl} onClick={() => handle_social_login("google")}>
                <img className={styles.socialIcon} src={socialGoogle} alt="" />
              </a>
            </div>

            <div className={styles.social_items}>
              <a href={loginUrl} onClick={() => handle_social_login("kakao")}>
                <img className={styles.socialIcon} src={socialKakao} alt="" />
              </a>
            </div>

            <div className={styles.social_items}>
              <a href={loginUrl} onClick={() => handle_social_login("naver")}>
                <img className={styles.socialIcon} src={socialNaver} alt="" />
              </a>
            </div>

            <div className={styles.social_items}>
              <a href={loginUrl} onClick={() => handle_social_login("github")}>
                <img className={styles.socialIcon} src={socialGithub} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
