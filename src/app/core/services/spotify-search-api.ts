import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { SpotifyPage, Track, Artist, Album } from '../interfaces/spotify-response';

export interface SearchResponse {
  tracks: SpotifyPage<Track>;
  artists: SpotifyPage<Artist>;
  albums: SpotifyPage<Album>;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchApi {
  #http = inject(HttpClient);

  search(query: string, type: string = 'track,artist,album', limit: number = 20): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', type)
      .set('limit', limit.toString());

    return this.#http.get<SearchResponse>(`${env.spotify.apiUrl}/v1/search`, { params });
  }

  searchTracks(query: string, limit: number = 20): Observable<{tracks: SpotifyPage<Track>}> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', limit.toString());

    return this.#http.get<{tracks: SpotifyPage<Track>}>(`${env.spotify.apiUrl}/v1/search`, { params });
  }
}
