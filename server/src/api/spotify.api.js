const { Router } = require("express");
const SpotifyController = require("../controller/spotifyController");
const verifyUser = require("../middleware/auth");

const route = Router();
const spotifyController = new SpotifyController();

route.get("/getOAuthUrl", spotifyController.getOAuthUrl);
route.post("/login", spotifyController.login);
route.get("/search", verifyUser, spotifyController.searchArtist);
route.get("/albums/:artistId", verifyUser, spotifyController.getArtistAlbums);
route.get("/album/:albumId", verifyUser, spotifyController.getAlbumDetails);

module.exports = route;
