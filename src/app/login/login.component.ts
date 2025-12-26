import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    email = '';
    password = '';
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    login() {
        this.authService.login(this.email, this.password)
            .subscribe({
                next: () => this.router.navigate(['/']),
                error: () => this.error = 'Invalid email or password'
            });
    }
}
