import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { GetAuthUrl } from 'src/app/store/actions/spotify.action';
import { SpotifyState } from 'src/app/store/state/spotify.state';
import { parseToken } from 'src/app/utils/helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  title = 'frontend';
  authUrl: string = '';
  subscriptions: Record<string, Subscription> = {};

  constructor(private store: Store) {}

  ngOnInit() {
    const user = parseToken();
    if (user && user.id) {
      this.store.dispatch(new Navigate(['/home']));
    } else {
      this.store.dispatch(new GetAuthUrl());
      this.subscriptions.authUrl = this.store
        .select(SpotifyState.getAuthUrl)
        .subscribe((url: string) => {
          this.authUrl = url;
        });
    }
  }

  openLoginPage() {
    window.location.href = this.authUrl;
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
