import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { CanActivate } from '@angular/router';
import { parseToken } from './helper';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate() {
    const user = parseToken();
    if (user && user.id) {
      return true;
    }

    this.store.dispatch(new Navigate(['/signin']));
    return false;
  }
}
