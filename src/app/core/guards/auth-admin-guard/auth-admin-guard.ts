import { Component, inject } from '@angular/core';
import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from '../../service/authservice/authservice';


export const AuthAdminGuard: CanActivateFn =  (route,state) =>{
  const authService = inject(AuthService)
  const router = inject(Router)
  const user = authService.currentUserData();
  
  if (user?.rol === "admin") {
    return true;
  }
  console.log("Debes tener rol admin para a acceder a esta ruta")

  return router.navigate(['/inicio']);

}

