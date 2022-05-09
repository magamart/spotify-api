const User = require("../db/models/user");
const Query = require("../db/models/query");
const Http = require("./http");
const { Types } = require("mongoose");

const { UserData } = require("../models/userModel");
// const { Types } = require('mongoose');

const callbackUrl = process.env.SPOTIFY_CALLBACK_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const apiUrls = {
  authorizationUrl: "https://accounts.spotify.com/",
  apiUrl: "https://api.spotify.com/v1/",
};

const http = new Http();

class SpotifyService {
  async generateOAuthUrl() {
    return `${apiUrls.authorizationUrl}authorize?client_id=${clientId}&response_type=code&redirect_uri=${callbackUrl}`;
  }

  async getAccessToken(code) {
    const url = `${apiUrls.authorizationUrl}api/token`;
    const body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl,
    };
    const result = await http.post(url, body, "token");
    return this.handleResponse(result);
  }

  async getSpotifyUser(accessToken) {
    const url = `${apiUrls.apiUrl}me`;
    const result = await http.get(
      url,
      this.getOauthSpotifyHeaders(accessToken)
    );
    console.log({ result });
    return this.handleResponse(result);
  }

  getOauthSpotifyHeaders(accessToken) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
  }

  handleResponse(result) {
    if (result.data) {
      return result.data;
    } else {
      return result;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id).populate({
        path: "searchQuerys",
        select: { _id: -1, query: 1 },
        options: {
          limit: 10,
        },
      });
      return user;
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  async getUserByUserId(userId) {
    try {
      const user = await User.findOne({ userId }).populate({
        path: "searchQuerys",
        select: { _id: -1, query: 1 },
        options: {
          limit: 10,
        },
      });
      return user;
    } catch (error) {
      console.log({ error });
      return null;
    }
  }

  async addNewUser(fullName, userId, accessToken) {
    let user = await this.getUserByUserId(userId);

    if (user) {
      await User.updateOne({ _id: user.id }, { accessToken });
      return UserData.createUserObject(user);
    } else {
      const displayName = fullName.split(" ");
      user = new User({
        name: displayName[0],
        surname: displayName[1],
        userId,
        accessToken,
      });

      await user.save();
    }
    return UserData.createUserObject(user);
  }

  async getArtistBySearchQuery(query, id) {
    try {
      let searchQuery = new Query({ query });
      searchQuery = await searchQuery.save();
      let user = await User.findByIdAndUpdate(Types.ObjectId(id), {
        $push: { searchQuerys: searchQuery._id },
      });
      const userData = await this.getUserById(id);
      const url = `${apiUrls.apiUrl}search?q=${query}&type=artist`;
      const artists = await http.get(
        url,
        this.getOauthSpotifyHeaders(user.accessToken)
      );
      return { artists: artists.data.artists, user: userData };
    } catch (error) {
      console.log({ error });
      return { artists: {}, user: {} };
    }
  }

  async getArtistAlbums(artistId, id) {
    const user = await this.getUserById(id);
    const url = `${apiUrls.apiUrl}artists/${artistId}/albums`;
    const artists = await http.get(
      url,
      this.getOauthSpotifyHeaders(user.accessToken)
    );
    return artists?.data?.items;
  }

  async getAlbumById(albumId, id) {
    const user = await this.getUserById(id);
    const url = `${apiUrls.apiUrl}albums/${albumId}`;
    const artists = await http.get(
      url,
      this.getOauthSpotifyHeaders(user.accessToken)
    );
    return artists?.data;
  }
}

module.exports = SpotifyService;
