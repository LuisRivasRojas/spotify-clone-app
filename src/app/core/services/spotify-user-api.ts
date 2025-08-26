import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { SpotifyPage, Playlist } from '../interfaces/spotify-response';

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  product: string;
  type: string;
  uri: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyUserApi {
  #http = inject(HttpClient);

  getUserProfile(): Observable<UserProfile> {
    return this.#http.get<UserProfile>(`${env.spotify.apiUrl}/v1/me`);
  }

  getUserPlaylists(limit: number = 20, offset: number = 0): Observable<SpotifyPage<Playlist>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    return this.#http.get<SpotifyPage<Playlist>>(`${env.spotify.apiUrl}/v1/me/playlists?${params.toString()}`);
  }
}
