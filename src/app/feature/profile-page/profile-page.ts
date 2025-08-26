import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyUserApi, UserProfile } from '../../core/services/spotify-user-api';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-white mb-6">Mi Perfil</h1>
      
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p class="text-gray-400 mt-2">Cargando perfil...</p>
      </div>

      <!-- Profile Content -->
      <div *ngIf="!isLoading() && userProfile()" class="max-w-2xl">
        <!-- Profile Header -->
        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <div class="flex items-center space-x-6">
                         <img 
               [src]="getProfileImage()" 
               [alt]="userProfile()?.display_name"
               class="w-24 h-24 rounded-full object-cover border-4 border-green-500"
             />
            <div>
              <h2 class="text-2xl font-bold text-white">{{ userProfile()?.display_name }}</h2>
              <p class="text-gray-400">{{ userProfile()?.email }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="text-sm text-gray-400">
                  {{ userProfile()?.followers?.total || 0 }} seguidores
                </span>
                <span class="text-sm text-gray-400">
                  {{ userProfile()?.country || 'N/A' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Información del Perfil</h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-700">
              <span class="text-gray-400">ID de Usuario:</span>
              <span class="text-white font-mono text-sm">{{ userProfile()?.id }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-700">
              <span class="text-gray-400">Tipo de Cuenta:</span>
              <span class="text-white">{{ userProfile()?.product || 'N/A' }}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-700">
              <span class="text-gray-400">Contenido Explícito:</span>
              <span class="text-white">
                {{ userProfile()?.explicit_content?.filter_enabled ? 'Filtrado' : 'Sin filtrar' }}
              </span>
            </div>
            
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-400">URI de Spotify:</span>
              <a 
                [href]="userProfile()?.external_urls?.spotify" 
                target="_blank"
                class="text-green-500 hover:text-green-400 text-sm truncate ml-2"
              >
                Ver en Spotify
              </a>
            </div>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-gray-800 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-500">{{ userProfile()?.followers?.total || 0 }}</div>
            <div class="text-gray-400 text-sm">Seguidores</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-500">{{ userProfile()?.images?.length || 0 }}</div>
            <div class="text-gray-400 text-sm">Imágenes</div>
          </div>
          
          <div class="bg-gray-800 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-500">{{ userProfile()?.product || 'Free' }}</div>
            <div class="text-gray-400 text-sm">Plan</div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading() && !userProfile()" class="text-center py-8">
        <p class="text-gray-400">No se pudo cargar el perfil</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(to bottom, #1a1a1a, #121212);
    }
  `]
})
export class ProfilePage implements OnInit {
  private userApi = inject(SpotifyUserApi);
  
  isLoading = signal(true);
  userProfile = signal<UserProfile | null>(null);

  getProfileImage(): string {
    const profile = this.userProfile();
    return profile?.images?.[0]?.url || 'assets/default-profile.png';
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.isLoading.set(true);
    
    this.userApi.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading.set(false);
      }
    });
  }
}
