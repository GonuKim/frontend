import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";

interface SocialCallbackProps {
  provider: string; // provider prop 추가
}

function SocialCallback({ provider }: SocialCallbackProps) {
  const navigate = useNavigate(); // useHistory 훅 사용

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    access_token?: string;
    refresh_token?: string;
  }>({});
  const [user, setUser] = useState(null);
  const location = useLocation();

  const [accessToken, setAccessToken] = useState<{ access_token?: string }>({});
  const [refreshToken, setRefreshToken] = useState<{ refresh_token?: string }>(
    {}
  );

  const customAxios = axios.create({
    baseURL:
      "http://tamago-laravel-rb-474417567.ap-northeast-2.elb.amazonaws.com:80",
    withXSRFToken: true,
    withCredentials: true,
  });

  function fetchUserData() {
    customAxios
      .get(`/api/user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + data.access_token,
        },
      })
      .then((response) => {
        setUser(response.data.user);
        console.log("data: ", response.data);
        console.log("reftoken:", data.refresh_token);
        console.log("acctoken:", data.access_token);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        console.log("data:", data);
      });
    window.location.href = "/Main"; // 이동할 페이지
  }

  useEffect(() => {
    console.log(provider, "dddd");
    customAxios
      .get(`/api/social/callback/${provider}${location.search}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        withXSRFToken: true,
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        setData(response.data);
        sessionStorage.setItem("accessToken", response.data.access_token || ""); // or provide a default value like 'defaultAccessToken'
        sessionStorage.setItem(
          "refreshToken",
          response.data.refresh_token || ""
        ); // or provide a default value like 'defaultRefreshToken'
        fetchUserData();
        console.log(response);
        console.log("location:", location);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("location:", location);
      });
  }, [location.search, provider, navigate]);

  if (loading) {
    return <DisplayLoading />;
  } else {
    if (user != null) {
      return <DisplayData data={user} />;
    } else {
      return (
        <div>
          <DisplayData data={data} />
          <div style={{ marginTop: 10 }}></div>
        </div>
      );
    }
  }
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

function DisplayData({ data }: { data: any }) {
  return (
    <div>
      <samp>{JSON.stringify(data, null, 2)}</samp>
    </div>
  );
}

export default SocialCallback;
