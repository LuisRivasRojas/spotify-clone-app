export interface SpotifyTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyPage<T> {
  href:     string;
  items:    T[];
  limit:    number;
  next:     string;
  offset:   number;
  previous: null;
  total:    number;
}

export interface Album {
  album_type:             AlbumTypeEnum;
  artists:                Artist[];
  available_markets:      string[];
  external_urls:          ExternalUrls;
  href:                   string;
  id:                     string;
  images:                 Image[];
  name:                   string;
  release_date:           Date;
  total_tracks:           number;
  type:                   AlbumTypeEnum;
  uri:                    string;
}

export enum AlbumTypeEnum {
  Album = "album",
  Ep = "ep",
}

export interface Artist {
  external_urls: ExternalUrls;
  href:          string;
  id:            string;
  name:          string;
  type:          ArtistType;
  uri:           string;
  images?:       Image[];
}

export interface ExternalUrls {
  spotify: string;
}

export enum ArtistType {
  Artist = "artist",
}

export interface Image {
  height: number;
  url:    string;
  width:  number;
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string | null;
  public: boolean | null;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}
