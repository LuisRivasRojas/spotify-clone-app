import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Album, SpotifyPage } from '../interfaces/spotify-response';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumApi {
  #http = inject(HttpClient);

  getNewReleases() {
    return this.#http.get<{albums: SpotifyPage<Album>}>(`${env.spotify.apiUrl}/v1/browse/new-releases`);
  }
}
