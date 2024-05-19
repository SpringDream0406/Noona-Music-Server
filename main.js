import express from "express";
import cors from "cors";
import { getData, getToken, isTokenExpired } from "./getData.js";

const app = express();
const port = 80;

let token;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extends: false }));

app.get("/", (req, res) => {
  console.log("/ 접속");
  res.send("기본 페이지 접속");
});

app.post("/getData", async (req, res) => {
  const { url } = req.body;
  try {
    if (isTokenExpired(token)) {
      token = await getToken();
    }
    const data = await getData(url, token);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.send(500).json({ error: "서버 에러" });
  }
});

app.listen(port, () => {
  console.log(`${port} listeng`);
});
