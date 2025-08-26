import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifySearchApi } from '../../core/services/spotify-search-api';
import { Track, Artist, Album } from '../../core/interfaces/spotify-response';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-white mb-6">Buscar música</h1>
      
      <!-- Search Input -->
      <div class="mb-8">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput()"
          placeholder="Buscar canciones, artistas o álbumes..."
          class="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p class="text-gray-400 mt-2">Buscando...</p>
      </div>

      <!-- Search Results -->
      <div *ngIf="!isLoading() && searchQuery() && (tracks().length > 0 || artists().length > 0 || albums().length > 0)">
        
        <!-- Tracks Section -->
        <div *ngIf="tracks().length > 0" class="mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Canciones</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              *ngFor="let track of tracks()" 
              class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                                 <img 
                   [src]="getAlbumImage(track.album)" 
                   [alt]="track.name"
                   class="w-12 h-12 rounded object-cover"
                 />
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-medium truncate">{{ track.name }}</h3>
                                     <p class="text-gray-400 text-sm truncate">
                     {{ getArtistNames(track.artists) }}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Artists Section -->
        <div *ngIf="artists().length > 0" class="mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Artistas</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              *ngFor="let artist of artists()" 
              class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer text-center"
            >
                             <img 
                 [src]="getArtistImage(artist)" 
                 [alt]="artist.name"
                 class="w-16 h-16 rounded-full object-cover mx-auto mb-2"
               />
              <h3 class="text-white font-medium text-sm truncate">{{ artist.name }}</h3>
            </div>
          </div>
        </div>

        <!-- Albums Section -->
        <div *ngIf="albums().length > 0" class="mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Álbumes</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              *ngFor="let album of albums()" 
              class="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
                             <img 
                 [src]="getAlbumImage(album)" 
                 [alt]="album.name"
                 class="w-full aspect-square rounded object-cover mb-2"
               />
              <h3 class="text-white font-medium text-sm truncate">{{ album.name }}</h3>
                             <p class="text-gray-400 text-xs truncate">
                 {{ getArtistNames(album.artists) }}
               </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!isLoading() && searchQuery() && tracks().length === 0 && artists().length === 0 && albums().length === 0" 
           class="text-center py-8">
        <p class="text-gray-400">No se encontraron resultados para "{{ searchQuery() }}"</p>
      </div>

      <!-- Initial State -->
      <div *ngIf="!searchQuery()" class="text-center py-8">
        <p class="text-gray-400">Escribe algo para comenzar a buscar</p>
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
export class SearchPage {
  private searchApi = inject(SpotifySearchApi);
  
  searchQuery = signal('');
  isLoading = signal(false);
  tracks = signal<Track[]>([]);
  artists = signal<Artist[]>([]);
  albums = signal<Album[]>([]);

  getArtistNames(artists: Artist[]): string {
    return artists?.map(a => a.name).join(', ') || '';
  }

  getAlbumImage(album: Album): string {
    return album.images?.[0]?.url || 'assets/default-album.png';
  }

  getArtistImage(artist: Artist): string {
    return artist.images?.[0]?.url || 'assets/default-artist.png';
  }

  onSearchInput() {
    const query = this.searchQuery();
    if (!query.trim()) {
      this.tracks.set([]);
      this.artists.set([]);
      this.albums.set([]);
      return;
    }

    this.isLoading.set(true);
    
    this.searchApi.search(query.trim()).subscribe({
      next: (response) => {
        this.tracks.set(response.tracks?.items || []);
        this.artists.set(response.artists?.items || []);
        this.albums.set(response.albums?.items || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error searching:', error);
        this.isLoading.set(false);
      }
    });
  }
}
