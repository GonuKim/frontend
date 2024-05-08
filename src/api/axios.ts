import axios from "axios";

const setConfig = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  return {
    baseURL:
      "http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com:80",
    withXSRFToken: true,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const instance = axios.create(setConfig());
const refreshToken = sessionStorage.getItem("refreshToken");

// refreshToken을 사용하여 새로운 토큰을 요청하는 함수
async function refreshAccessToken() {
  try {
    const response = await axios.post(
      `${instance.defaults.baseURL}/api/refresh`,
      refreshToken,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    // 에러 처리
  }
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
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

export default instance;
