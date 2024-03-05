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

const SignIn = () => {
  const [loginUrl, setLoginUrl] = useState();
  const [provider, setProvider] = useState("");

  const customAxios = axios.create({
    baseURL: "http://localhost:8000/",
    withXSRFToken: true,
    withCredentials: true,
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
      .get(`http://localhost:8000/api/social/${provider}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withXSRFToken: true,
        withCredentials: true,
      })
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
    console.log(formData);
  };
  const handleSubmit = async (e: FormEvent) => {
    try {
      console.log(formData);
      const response = await customAxios.post("/api/login", formData);
      console.log(response);
      console.log(response.data);

      const { access_token, refresh_token } = response.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      sessionStorage.setItem("accessToken", access_token);
      sessionStorage.setItem("refreshToken", refresh_token);

      alert("로그인에 성공했습니다.");
      window.location.href = "/Main"; // 이동할 페이지
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  };

  // const provider = 'kakao';

  // // const backendAPIKey = 'e581b0481076ae8faa28a52c157faff3';

  //

  return (
    <div className={styles.wrap}>
      <div className={styles.main_wrap}>
        <div className={styles.textContainer}>
          <div className={styles.h2}>
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
        </div>
        <div>
          <button className={styles.circle} onClick={handleSubmit}>
            로그인
          </button>
        </div>

        <div className={styles.social_link}>
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
  );
};

export default SignIn;
