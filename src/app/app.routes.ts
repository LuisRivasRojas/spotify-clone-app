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
      }
    ]
  }
];
