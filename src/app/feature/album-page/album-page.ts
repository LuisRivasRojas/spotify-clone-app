import { Component, inject, OnInit, signal } from '@angular/core';
import { SpotifyAlbumApi } from '../../core/services/spotify-album-api';
import { Album } from '../../core/interfaces/spotify-response';

@Component({
  selector: 'app-album-page',
  imports: [],
  templateUrl: './album-page.html',
  styles: ``
})
export class AlbumPage implements OnInit {
  albumApi = inject(SpotifyAlbumApi);
  albums = signal<Album[]>([]);

  ngOnInit(): void {
    this.getAlbums();
  }

  getAlbums(): void {
    this.albumApi.getNewReleases().subscribe(res => {
      console.log('albums:', res);
      this.albums.set(res.albums.items);
    })
  }
}
