import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { LoadAlbumDetails } from 'src/app/store/actions/spotify.action';
import { SpotifyState } from 'src/app/store/state/spotify.state';

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.scss'],
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  album: any = null;
  selectedLink: string | null = '';
  subscriptions: Record<string, Subscription> = {};

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.route = this.route.params.subscribe((params) => {
      const { albumId } = params;
      this.store.dispatch(new LoadAlbumDetails(albumId));
    });

    this.subscriptions.albumDetails = this.store
      .select(SpotifyState.getAlbumDetails)
      .subscribe((album: any) => {
        album?.tracks?.items.map((item: any) =>
          console.log({ 'item.preview_url': item.preview_url })
        );
        this.album = album;
      });
  }

  playPreview(link: string) {
    this.selectedLink = link;
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
