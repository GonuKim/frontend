import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  withXSRFToken: true,
  withCredentials: true,
});

// refreshToken을 사용하여 새로운 토큰을 요청하는 함수
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post(
      `${instance.defaults.baseURL}/api/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token: ", error);
    throw error;
  }
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newTokens = await refreshAccessToken(
          sessionStorage.getItem("refreshToken") || ""
        );
        console.log("newTokens::", newTokens);
        sessionStorage.setItem("accessToken", newTokens.token);
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newTokens.accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
