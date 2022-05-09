const Jwt = require("../services/jwtService");
const SpotifyService = require("../services/spotifyService");
const { ApiResponse } = require("../models/responseModel");

const spotifyService = new SpotifyService();
const jwtService = new Jwt();

class SpotifyController {
  async getOAuthUrl(req, res) {
    try {
      return res
        .status(200)
        .send(
          new ApiResponse(
            200,
            await spotifyService.generateOAuthUrl(),
            "Url successfully generated"
          )
        );
    } catch (error) {
      return res.status(500).send(new ApiResponse());
    }
  }

  async login(req, res) {
    try {
      const { code } = req.body;
      if (!code) {
        return res
          .status(400)
          .send(new ApiResponse(400, null, "Authorization code is required"));
      }

      const tokenData = await spotifyService.getAccessToken(code);
      const userInfon = await spotifyService.getSpotifyUser(
        tokenData.access_token
      );
      const user = await spotifyService.addNewUser(
        userInfon.display_name,
        userInfon.id,
        tokenData.access_token
      );
      user.token = jwtService.generateToken(user);

      return res
        .status(200)
        .send(new ApiResponse(200, user, "User successfully loged in"));
    } catch (error) {
      console.log({ error });
      return res.status(500).send(new ApiResponse());
    }
  }

  async currentUser(req, res) {
    try {
    } catch (error) {
      return res.status(500).send(new ApiResponse());
    }
  }

  async searchArtist(req, res) {
    try {
      const { query } = req.query;
      const result = await spotifyService.getArtistBySearchQuery(
        query,
        req.user.id
      );
      if ("error" in result) {
        return res.status(400).send(new ApiResponse(400, null, result.error));
      }
      return res
        .status(200)
        .send(new ApiResponse(200, result, "Artists successfully retrived"));
    } catch (error) {
      console.log({ error });
      return res.status(500).send(new ApiResponse());
    }
  }

  async searchArtist(req, res) {
    try {
      const { query } = req.query;
      const result = await spotifyService.getArtistBySearchQuery(
        query,
        req.user.id
      );
      if ("error" in result) {
        return res
          .status(400)
          .send(
            new ApiResponse(400, null, result ? result.error : "Bad request")
          );
      }
      return res
        .status(200)
        .send(new ApiResponse(200, result, "Artists successfully retrived"));
    } catch (error) {
      console.log({ error });
      return res.status(500).send(new ApiResponse());
    }
  }

  async getArtistAlbums(req, res) {
    try {
      const { artistId } = req.params;
      const albums = await spotifyService.getArtistAlbums(
        artistId,
        req.user.id
      );
      if (!albums) {
        return res.status(400).send(new ApiResponse(400, null, "Bad request"));
      }
      return res
        .status(200)
        .send(
          new ApiResponse(200, albums, "Artists albums successfully retrived")
        );
    } catch (error) {
      console.log({ error });
      return res.status(500).send(new ApiResponse());
    }
  }

  async getAlbumDetails(req, res) {
    try {
      const { albumId } = req.params;
      const album = await spotifyService.getAlbumById(albumId, req.user.id);
      if ("error" in album) {
        return res
          .status(400)
          .send(
            new ApiResponse(400, null, album ? album.error : "Bad request")
          );
      }
      return res
        .status(200)
        .send(
          new ApiResponse(200, album, "Albums details successfully retrived")
        );
    } catch (error) {
      console.log({ error });
      return res.status(500).send(new ApiResponse());
    }
  }
}

module.exports = SpotifyController;
