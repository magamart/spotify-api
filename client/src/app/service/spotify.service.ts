import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../models/response.model';
import { getToken } from '../utils/helper';
import { BaseApi } from '../core/base.api';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService extends BaseApi {
  spotifyUrl: string = 'http://localhost:8080/spotify/';

  constructor(public http: HttpClient) {
    super(http);
  }

  getAuthUrl() {
    return this.get('getOAuthUrl');
  }

  loginUser(code: string) {
    return this.post('login', { code });
  }

  searchArtist(query: string) {
    return this.get(`search?query=${query}`);
  }

  getArtistAlbums(artistId: string) {
    return this.get(`albums/${artistId}`);
  }

  getAlbumDetails(albumId: string) {
    return this.get(`album/${albumId}`);
  }
}
