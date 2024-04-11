import express from "express";
import cors from "cors";
import { getData } from "./getData.js";

const app = express();
const port = 3001;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extends: false }));

app.get("/", (req, res) => {
  console.log("/ 접속");
  res.send("get");
});

app.post("/getData", async (req, res) => {
  const { url } = req.body;
  console.log(url);
  try {
    const data = await getData(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.send(500).json({ error: "서버 에러" });
  }
});

app.listen(port, () => {
  console.log(`${port} listeng`);
});
