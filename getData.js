import "dotenv/config";
import fetch from "node-fetch";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken() {
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

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

const token = await getToken();

// 데이터 요청
export const getData = async (url) => {
  // 토큰이 없을 경우 token 요청
  if (!token) {
    token = await getToken();
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // 토큰이 만료되어 401 에러가 날 경우 토큰 다시 요청 하고 getData 다시 수행
    if (error.status === 401) {
      await getToken();
      return await getData(url);
    } else {
      console.error("Error:", error);
    }
  }
};
