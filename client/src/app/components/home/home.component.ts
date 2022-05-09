import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  EmptyArtistList,
  SearchArtists,
} from 'src/app/store/actions/spotify.action';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { SpotifyState } from 'src/app/store/state/spotify.state';
import { UserInterface } from 'src/app/models/user.model';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private onChangeSubject = new Subject<string>();

  userData: UserInterface | null = null;
  artists: any[] = [];
  searchValue: string = '';
  querys: { query: string; _id: string }[] = [];
  subscriptions: Record<string, Subscription> = {};

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.debounce = this.onChangeSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.store.dispatch(new SearchArtists(value));
      });

    this.subscriptions.artists = this.store
      .select(SpotifyState.getArtists)
      .subscribe((artists: any) => {
        this.artists = artists?.items || [];
      });

    this.subscriptions.users = this.store
      .select(SpotifyState.getUser)
      .subscribe((userData: UserInterface | null) => {
        this.userData = userData;
        this.querys = userData?.querys || userData?.searchQuerys || [];
        console.log({ userData, 'this.querys': this.querys });
      });
  }

  search(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.onChangeSubject.next(value);
  }

  moveToArtistPage(artist: any) {
    this.store.dispatch(new EmptyArtistList());
    this.store.dispatch(new Navigate([`/album/${artist.id}`]));
  }

  searchItem(query: string) {
    this.onChangeSubject.next(query);
    this.searchValue = query;
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
