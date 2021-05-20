import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthActions } from './auth/auth-action.types';

import { loginSelector, logoutSelector } from './auth/auth.selector';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private store: Store
  ) {}

  @ViewChild(MatDrawer) drawer!: MatDrawer;

  loggedIn$: Observable<boolean>;
  loggedOut$: Observable<boolean>;

  ngOnInit() {
    this.router.events
      .pipe(filter((route) => route instanceof NavigationEnd))
      .subscribe(() => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });

    this.loggedIn$ = this.store.select(loginSelector);
    this.loggedOut$ = this.store.select(logoutSelector);
  }

  toggleSidenav() {
    this.drawer.toggle();
  }

  logout() {
    this.authService
      .logout()
      .subscribe(() => this.store.dispatch(AuthActions.logout()));
  }
}
