import React, {useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Navbar from "../components/Navbar"
import logo from "../img/tamago.png";
import styles from "../css/SignIn.module.css"
import axios from 'axios';


const SignIn = () => {
  
  const [formData, setFormData] = useState({
    name:"",
    password: "",
  });

  

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  
  useEffect(() => {
    // 세션 스토리지에서 토큰을 가져옵니다.
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const storedRefreshToken = sessionStorage.getItem('refreshToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(formData)
  };

  const customAxios = axios.create({
    baseURL: 'http://localhost:8000/',
    'withXSRFToken': true,
    "withCredentials": true,
  });

  const handleSubmit = async (e:FormEvent) => {

    try {
      console.log(formData);
      const response = await customAxios.post('/api/login', formData);
      console.log(response);
      console.log(response.data);
      // access token 이랑 refresh token 프론트단에서 관리해야함  
      // 유저정보도 보내주는데 혹시 메인페이지에 유저 이름이나 이런거 정보 간단하게 띄울꺼면 response 에서 꺼내쓰면됨
      
      const { access_token, refresh_token } = response.data;

      // 보안상 문제로 세션스토리지로 저장
       setAccessToken(access_token);
       setRefreshToken(refresh_token);

      sessionStorage.setItem('accessToken', access_token);
      sessionStorage.setItem('refreshToken', refresh_token);


      
    
      
      
      // 로그인 성공 시 알람 창 띄우고 페이지 이동
      alert('로그인에 성공했습니다.');
      window.location.href = '/Main'; // 이동할 페이지

    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
};

const handleSocialLogin = async (provider: string) => {
  try {
    const response = await axios.post(`/api/social/${provider}`);
    console.log(response.data);
    // 소셜 로그인 성공 시 처리
  } catch (error) {
    console.error('소셜 로그인 중 오류 발생:', error);
    // 오류 처리
  }
};
  
 





    return (
    <div className={styles.wrap}>
      <Navbar />
    
      <div className={styles.main_wrap}>
    
 

        <div className={styles.textContainer}>
  
        <div className={styles.h2}>
          <img src={logo} alt="" />
        </div>
          <h2 className={styles.h2}>
            아이디
          </h2>
        <div>
           <input type="text" className={styles.input} placeholder="아이디"
           name="name" 
           value={formData.name} 
           onChange={handleInputChange} />
        </div>
  
          <h2 className={styles.h2}>
            비밀번호
          </h2>
          <div>
            <input type="password" className={styles.input} placeholder="비밀번호" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} />
        </div>

      </div>
  
        <div>
          <button className={styles.circle} onClick={handleSubmit}>로그인</button>
        </div>
        

        

        


  
      </div>
    </div>
    );
  };
  export default SignIn;

