import { Routes } from '@angular/router';
import { Moviedetails } from './features/moviedetails/moviedetails';
import { Header } from './layout/header/header';
import { Home } from './features/peliculas/home/home';
import { Homec } from './candy/home/homec';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
    {path: 'inicio',component :Home,pathMatch:'full' },
    {path: 'candys',component: Homec,pathMatch : 'full'},
    {path: 'registrarse',component : Register,pathMatch: 'full'},
    {path : 'iniciar',component: Login,pathMatch: 'full'}
    

];
