import { Component, inject } from '@angular/core';
import { SpotifyAuthApi } from '../../core/services/spotify-auth-api';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styles: ``
})
export class MainLayout {
  authApi = inject(SpotifyAuthApi);

  login(): void {
    this.authApi.login();
  }
}
