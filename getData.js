import "dotenv/config";
import fetch from "node-fetch";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// 토큰 요청
export async function getToken() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    });

    let token = await response.json();
    token.expireTime = Date.now() + token.expires_in * 1000;
    return token;
  } catch (error) {
    console.log(error);
  }
}

export const isTokenExpired = (token) => {
  return !token || token?.expireTime < Date.now();
};

// 데이터 요청
export const getData = async (url, token) => {
  // 토큰이 없을 경우 token 요청
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
