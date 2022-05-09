export class GetAuthUrl {
  static readonly type = '[Spotify] Get spotify url';
}

export class SigninUser {
  static readonly type = '[Spotify] Signin';
  constructor(public code: string) {}
}

export class SearchArtists {
  static readonly type = '[Spotify] Search Artists';
  constructor(public query: string) {}
}

export class EmptyArtistList {
  static readonly type = '[Spotify] Remove Search Result';
}

export class LoadAlbums {
  static readonly type = '[Spotify] Get Artist Albums';
  constructor(public artistId: string) {}
}

export class LoadAlbumDetails {
  static readonly type = '[Spotify] Load Album Details';
  constructor(public albumId: string) {}
}
