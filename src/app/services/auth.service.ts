import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: User = {
    id: 'u1',
    name: 'You',
    role: 'MEMBER' // change to MANAGER to test
  };

  isManager() {
    return this.currentUser.role === 'MANAGER';
  }
}
