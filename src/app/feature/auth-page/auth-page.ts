import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthApi } from '../../core/services/spotify-auth-api';

@Component({
  selector: 'app-auth-page',
  imports: [],
  templateUrl: './auth-page.html',
  styles: ``
})
export class AuthPage implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #authApi = inject(SpotifyAuthApi);

  ngOnInit(): void {
    const code = this.#route.snapshot.queryParams['code'];
    console.log('Authorization code:', code);
    this.#authApi.exchangeCodeForToken(code).subscribe(
      res => {
        console.log('Spotify token response:', res);
        this.#router.navigate(['/']).then();
      }
    )
  }
}
