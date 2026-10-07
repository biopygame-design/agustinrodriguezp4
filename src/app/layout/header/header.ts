<<<<<<< HEAD
import { Component, inject } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/service/authservice/authservice';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { RolDirectiva } from '../../shared/components/rol.directiva/rol.directiva';


@Component({
  imports: [RouterLink,RouterLinkActive,RolDirectiva],
=======
import { Component } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';


@Component({
  imports: [RouterLink,RouterLinkActive],
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
<<<<<<< HEAD
  authService = inject(AuthService);
  private router = inject(Router);

  AuthService: any;
  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
  
}
