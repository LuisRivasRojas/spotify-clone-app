import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyUserApi } from '../../core/services/spotify-user-api';
import { Playlist } from '../../core/interfaces/spotify-response';

@Component({
  selector: 'app-playlists-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-white mb-6">Mis Playlists</h1>
      
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p class="text-gray-400 mt-2">Cargando playlists...</p>
      </div>

      <!-- Playlists Grid -->
      <div *ngIf="!isLoading() && playlists().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          *ngFor="let playlist of playlists()" 
          class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
        >
          <!-- Playlist Image -->
          <div class="relative mb-4">
                         <img 
               [src]="getPlaylistImage(playlist)" 
               [alt]="playlist.name"
               class="w-full aspect-square rounded object-cover"
             />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Playlist Info -->
          <div>
            <h3 class="text-white font-semibold truncate mb-1">{{ playlist.name }}</h3>
            <p class="text-gray-400 text-sm mb-2">
              {{ playlist.tracks.total }} canciones
            </p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">
                {{ playlist.owner.display_name }}
              </span>
              <span 
                *ngIf="playlist.public !== null"
                class="text-xs px-2 py-1 rounded-full"
                [class]="playlist.public ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'"
              >
                {{ playlist.public ? 'Pública' : 'Privada' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && playlists().length === 0" class="text-center py-8">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">No tienes playlists</h3>
        <p class="text-gray-400">Crea tu primera playlist en Spotify para verla aquí</p>
      </div>

      <!-- Error State -->
      <div *ngIf="!isLoading() && error()" class="text-center py-8">
        <div class="w-24 h-24 mx-auto mb-4 bg-red-900 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Error al cargar playlists</h3>
        <p class="text-gray-400">{{ error() }}</p>
        <button 
          (click)="loadPlaylists()"
          class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Load More Button -->
      <div *ngIf="!isLoading() && playlists().length > 0 && hasMorePlaylists()" class="text-center mt-8">
        <button 
          (click)="loadMorePlaylists()"
          class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cargar más playlists
        </button>
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
export class PlaylistsPage implements OnInit {
  private userApi = inject(SpotifyUserApi);
  
  isLoading = signal(true);
  playlists = signal<Playlist[]>([]);
  error = signal<string | null>(null);
  offset = signal(0);
  hasMore = signal(true);

  getPlaylistImage(playlist: Playlist): string {
    return playlist.images?.[0]?.url || 'assets/default-playlist.png';
  }

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.isLoading.set(true);
    this.error.set(null);
    this.offset.set(0);
    
    this.userApi.getUserPlaylists(20, 0).subscribe({
      next: (response) => {
        this.playlists.set(response.items);
        this.hasMore.set(response.next !== null);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.error.set('No se pudieron cargar las playlists');
        this.isLoading.set(false);
      }
    });
  }

  loadMorePlaylists() {
    const currentOffset = this.offset() + 20;
    this.offset.set(currentOffset);
    
    this.userApi.getUserPlaylists(20, currentOffset).subscribe({
      next: (response) => {
        this.playlists.update(playlists => [...playlists, ...response.items]);
        this.hasMore.set(response.next !== null);
      },
      error: (error) => {
        console.error('Error loading more playlists:', error);
        this.offset.update(offset => offset - 20);
      }
    });
  }

  hasMorePlaylists(): boolean {
    return this.hasMore();
  }
}
