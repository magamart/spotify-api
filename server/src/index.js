const express = require("express");
const cors = require("cors");

const SpotifyApi = require("./api/spotify.api");
const connect = require("./db/config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
connect();

app.use("/spotify", SpotifyApi);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
