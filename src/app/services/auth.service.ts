import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: User = {
    id: 1,
    empid: 'EMP001',
    name: 'You',
    role: 'Developer',
    location: 'Mumbai',
    module: 'Sales',
    email: 'you@example.com',
    manager_access: 0,
  };

  isManager() {
    return this.currentUser.manager_access === 1;
  }
}
