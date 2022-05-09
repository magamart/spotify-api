import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { SigninUser } from 'src/app/store/actions/spotify.action';
import { SpotifyState } from 'src/app/store/state/spotify.state';
import { UserInterface } from 'src/app/models/user.model';
import { Navigate } from '@ngxs/router-plugin';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit, OnDestroy {
  code: string = '';
  subscriptions: Record<string, Subscription> = {};

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.params = this.route.queryParams.subscribe((params) => {
      this.code = params.code;
      this.store.dispatch(new SigninUser(this.code));
      this.subscriptions.user = this.store
        .select(SpotifyState.getUser)
        .subscribe((userData: UserInterface | null) => {
          if (userData) {
            this.store.dispatch(new Navigate(['/home']));
          }
        });
    });
  }

  ngOnDestroy() {
    for (let key in this.subscriptions) {
      this.subscriptions[key]?.unsubscribe();
    }
  }
}
