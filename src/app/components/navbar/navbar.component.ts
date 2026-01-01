import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {

  showMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  navigate(path: string) {
    this.showMenu = false;
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.authService.exitGuestMode();
    this.router.navigate(['/login']);
  }
  isGuest() {
    return this.authService.isGuest();
  }
  exitGuestMode() {
    this.authService.exitGuestMode();
    this.router.navigate(['/login']);
  }
}
