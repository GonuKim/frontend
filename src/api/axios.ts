import axios from "axios";

// Axios 인스턴스를 설정하는 함수
const setConfig = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  // const xsrfToken = localStorage.getItem("XSRF-TOKEN");

  return {
    baseURL:
      "http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // "X-XSRF-TOKEN": xsrfToken,
    },
    withCredentials: true,
  };
};

// CSRF 토큰을 받아오는 함수
// async function getCsrfToken() {
//   try {
//     const response = await axios.get(
//       "http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com/sanctum/csrf-cookie",
//       {
//         withCredentials: true, // headers가 아닌 설정 부분에 위치
//       }
//     );
//     console.log("CSRF token set", response);

//     // 응답 데이터에서 직접 CSRF 토큰을 추출하여 로컬 스토리지에 저장합니다.
//     const xsrfToken = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("XSRF-TOKEN="))
//       ?.split("=")[1];

//     localStorage.setItem("XSRF-TOKEN", xsrfToken);
//   } catch (error) {
//     console.error("Error fetching CSRF token:", error);
//   }
// }

const instance = axios.create(setConfig());
const refreshToken = sessionStorage.getItem("refreshToken");

// refreshToken을 사용하여 새로운 액세스 토큰을 요청하는 함수
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${instance.defaults.baseURL}/api/refresh`,
      { refreshToken }, // refreshToken을 본문으로 보냅니다.
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newTokens = await refreshAccessToken();
        console.log("newTokens::", newTokens);

        if (newTokens && newTokens.token) {
          sessionStorage.setItem("accessToken", newTokens.token);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newTokens.token}`;
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newTokens.token}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 애플리케이션 초기 로드 시 CSRF 토큰을 받아옵니다.
// getCsrfToken();

export default instance;
