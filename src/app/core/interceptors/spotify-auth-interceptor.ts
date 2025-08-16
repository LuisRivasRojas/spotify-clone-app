import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpotifyAuthApi } from '../services/spotify-auth-api';

export const spotifyAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('https://api.spotify.com/')) {
    return next(req);
  }

  const auth = inject(SpotifyAuthApi);
  const token = auth.token;

  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${ token }` }
  });
  return next(authReq);
};
