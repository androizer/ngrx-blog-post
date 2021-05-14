import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  @ViewChild(MatDrawer) drawer!: MatDrawer;

  ngOnInit() {
    this.router.events
      .pipe(filter((route) => route instanceof NavigationEnd))
      .subscribe(() => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });
  }

  toggleSidenav() {
    this.drawer.toggle();
  }

  logout() {
    return this.authService.logout().subscribe();
  }
}
