import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { User } from './auth/models';
import { AuthActions } from './auth/redux/auth.actions';
import { AuthSelectors } from './auth/redux/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly router: Router, private readonly store: Store) {}

  @ViewChild(MatDrawer) drawer: MatDrawer;
  currentUser$: Observable<User>;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  ngOnInit() {
    this.router.events
      .pipe(filter((route) => route instanceof NavigationEnd))
      .subscribe(() => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });

    this.currentUser$ = this.store.select(AuthSelectors.currentUser);
    this.isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn);
    this.isLoggedOut$ = this.store.select(AuthSelectors.isLoggedOut);
  }

  toggleSidenav() {
    this.drawer.toggle();
  }

  logout() {
    this.store.dispatch(AuthActions.logoutRequested());
  }
}
