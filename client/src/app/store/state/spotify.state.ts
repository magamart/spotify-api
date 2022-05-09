import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ApiResponse } from 'src/app/models/response.model';
import { UserInterface } from 'src/app/models/user.model';
import { SpotifyService } from 'src/app/service/spotify.service';
import { parseToken, setToken } from 'src/app/utils/helper';

import {
  LoadAlbumDetails,
  LoadAlbums,
  GetAuthUrl,
  SigninUser,
  SearchArtists,
  EmptyArtistList,
} from '../actions/spotify.action';

export interface SpotifyStateModel {
  authUrl: string;
  userData: UserInterface | null;
  artists: any;
  albums: any[];
  selectedAlbum: any;
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    authUrl: '',
    userData: null,
    artists: null,
    albums: [],
    selectedAlbum: null,
  },
})
@Injectable()
export class SpotifyState {
  constructor(private spotifyService: SpotifyService) {}

  @Selector()
  static getAuthUrl(state: SpotifyStateModel) {
    return state.authUrl;
  }

  @Selector()
  static getUser(state: SpotifyStateModel) {
    return state.userData || parseToken();
  }

  @Selector()
  static getArtists(state: SpotifyStateModel) {
    return state.artists;
  }

  @Selector()
  static getArtistAlbums(state: SpotifyStateModel) {
    return state.albums;
  }

  @Selector()
  static getAlbumDetails(state: SpotifyStateModel) {
    return state.selectedAlbum;
  }

  @Action(GetAuthUrl)
  getAuthUrl(ctx: StateContext<SpotifyStateModel>) {
    const state = ctx.getState();
    return this.spotifyService.getAuthUrl().subscribe((result: ApiResponse) => {
      ctx.setState({
        ...state,
        authUrl: result.data,
      });
    });
  }

  @Action(SigninUser)
  loginUser(ctx: StateContext<SpotifyStateModel>, action: { code: string }) {
    const state = ctx.getState();
    return this.spotifyService
      .loginUser(action.code)
      .subscribe((result: ApiResponse) => {
        setToken(result.data.token);
        ctx.setState({
          ...state,
          userData: result.data,
        });
      });
  }

  @Action(SearchArtists)
  searchArtists(
    ctx: StateContext<SpotifyStateModel>,
    action: { query: string }
  ) {
    const state = ctx.getState();
    return this.spotifyService
      .searchArtist(action.query)
      .subscribe((result: ApiResponse) => {
        const { artists, user } = result?.data || {};
        console.log({ artists, user });
        ctx.setState({
          ...state,
          userData: user.querys ? user : state.userData,
          artists,
        });
      });
  }

  @Action(EmptyArtistList)
  removeArtists(ctx: StateContext<SpotifyStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      artists: [],
    });
  }

  @Action(LoadAlbums)
  getArtistAlbums(
    ctx: StateContext<SpotifyStateModel>,
    action: { artistId: string }
  ) {
    const state = ctx.getState();
    return this.spotifyService
      .getArtistAlbums(action.artistId)
      .subscribe((result: ApiResponse) => {
        ctx.setState({
          ...state,
          albums: result.data,
        });
      });
  }

  @Action(LoadAlbumDetails)
  getAlbumDetails(
    ctx: StateContext<SpotifyStateModel>,
    action: { albumId: string }
  ) {
    const state = ctx.getState();
    return this.spotifyService
      .getAlbumDetails(action.albumId)
      .subscribe((result: ApiResponse) => {
        ctx.setState({
          ...state,
          selectedAlbum: result.data,
        });
      });
  }
}
