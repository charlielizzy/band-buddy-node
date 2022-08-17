import express from "express";
import cors from "cors";
// import fetch from "node-fetch";
// import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import qs from "qs";
import { createSecretKey } from "crypto";

dotenv.config();
const app = express();
console.log(process.env.PORT);
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});

const upload = multer({ storage });
app.post("/audio_info", upload.single("file"), async (req, res) => {
  const payload = {
    api_token: process.env.AUDDIO_API_TOKEN,
    file: fs.createReadStream(req.file.path),
    return: "spotify",
  };
  try {
    const result = await axios({
      method: "post",
      url: "https://api.audd.io/",
      data: payload,
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { data } = result;
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/spotify-auth", async (req, res) => {
  const payload = {
    grant_type: "authorization_code",
    code: req.body.code,
    redirect_uri: process.env.REDIRECT_URI,
  };
  try {
    const result = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: qs.stringify(payload),
      headers: {
        Authorization: `Basic ${process.env.CLIENT_DETAILS}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.send(result.data);
    console.log("result.data", result.data);
  } catch (error) {
    res.send(500)
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
