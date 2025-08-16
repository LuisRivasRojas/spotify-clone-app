import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { SpotifyTokenResponse } from '../interfaces/spotify-response';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthApi {
  #http = inject(HttpClient);

  login(): void {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.spotify.clientId,
      scope: env.spotify.scope,
      redirect_uri: env.spotify.redirectUri,
    });

    window.location.href = `${ env.spotify.authorizationUrl }?${ params.toString() }`;
  }

  exchangeCodeForToken(code: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.spotify.redirectUri
    });

    const basic = btoa(`${ env.spotify.clientId }:${ env.spotify.clientSecret }`);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${ basic }`
    };

    return this.#http.post<SpotifyTokenResponse>(env.spotify.tokenUrl, body.toString(), { headers })
      .pipe(tap(res => localStorage.setItem('spotify_token', res.access_token)));
  }

  logout(): void {
    localStorage.removeItem('spotify_token');
  }

  get isLogging(): boolean {
    return !!localStorage.getItem('spotify_token');
  }

  get token(): string | null {
    return localStorage.getItem('spotify_token');
  }

}
