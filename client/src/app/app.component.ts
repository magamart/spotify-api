import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { GetAuthUrl } from './store/actions/spotify.action';
import { SpotifyState } from './store/state/spotify.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend';
  authUrl: string = '';
  subscriptions: Record<string, Subscription> = {};

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetAuthUrl());
    this.subscriptions.url = this.store
      .select(SpotifyState.getAuthUrl)
      .subscribe((url: string) => {
        this.authUrl = url;
      });
  }

  openLoginPage() {
    this.store.dispatch(new Navigate([this.authUrl]));
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
