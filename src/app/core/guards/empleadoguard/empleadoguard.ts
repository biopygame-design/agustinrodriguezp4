import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/authservice/authservice';
import { CanActivateFn } from '@angular/router';


export const Empleadoguard: CanActivateFn =  (route,state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const user = authService.currentUserData();
  
  if (user?.rol === "empleado") {
    return true;
  }
  console.log("Debes tener rol empleado para a acceder a esta ruta")

  return router.navigate(['/inicio']);

}



