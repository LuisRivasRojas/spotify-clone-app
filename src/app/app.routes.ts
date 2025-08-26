import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthPage } from './feature/auth-page/auth-page';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPage
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'albums',
        loadComponent: () => import('./feature/album-page/album-page').then(c => c.AlbumPage)
      },
      {
        path: 'search',
        loadComponent: () => import('./feature/search-page/search-page').then(c => c.SearchPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/profile-page/profile-page').then(c => c.ProfilePage)
      },
      {
        path: 'playlists',
        loadComponent: () => import('./feature/playlists-page/playlists-page').then(c => c.PlaylistsPage)
      },
      {
        path: '',
        redirectTo: 'albums',
        pathMatch: 'full'
      }
    ]
  }
];
