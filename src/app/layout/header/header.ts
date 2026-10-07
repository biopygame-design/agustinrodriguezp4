import { Component, inject } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/service/authservice/authservice';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { RolDirectiva } from '../../shared/components/rol.directiva/rol.directiva';


@Component({
  imports: [RouterLink,RouterLinkActive,RolDirectiva],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  authService = inject(AuthService);
  private router = inject(Router);

  AuthService: any;
  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
  
}
