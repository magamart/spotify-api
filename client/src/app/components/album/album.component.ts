import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { LoadAlbums } from 'src/app/store/actions/spotify.action';
import { SpotifyState } from 'src/app/store/state/spotify.state';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  selectedArtist: any = null;
  albums: any[] = [];
  subscriptions: Record<string, Subscription> = {};

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.route = this.route.params.subscribe((params) => {
      const { artistsId } = params;
      this.store.dispatch(new LoadAlbums(artistsId));
    });

    this.store.select(SpotifyState.getArtistAlbums).subscribe((albums) => {
      this.albums = albums;
    });
  }

  toDetailsPage(album: any) {
    this.store.dispatch(new Navigate([`/albumDetails/${album.id}`]));
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
