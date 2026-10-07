import { Routes } from '@angular/router';
import { Moviedetails } from './features/moviedetails/moviedetails';
import { Header } from './layout/header/header';
import { Home } from './features/peliculas/home/home';
import { Homec } from './candy/home/homec';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { AgregarPelicula } from './features/agregar-pelicula/agregar-pelicula';
import { Butacas } from './features/butacas/butacas';
import { CrearFuncionComponent } from './features/crear-funcion-component/crear-funcion-component';
import { ValidarEntrada } from './features/validar-entrada/validar-entrada';
import { PeliculasPreventa } from './features/peliculas-preventa/peliculas-preventa';
import { Carrito } from './features/carrito/carrito';
import { GenerarPromos } from './features/generar-promos/generar-promos';
import { Listapromos } from './features/listapromos/listapromos';
import { Perfilcompras } from './features/perfilcompras/perfilcompras';
import { CrearCandy } from './features/crear-candy/crear-candy';
import { Adminlogs } from './features/adminlogs/adminlogs';
import { AdminEstadisticas } from './features/admin-estadisticas/admin-estadisticas';
import { AuthAdminGuard } from './core/guards/auth-admin-guard/auth-admin-guard';
import { Modificarpelicula } from './features/modificarpelicula/modificarpelicula';
import { Empleadoguard } from './core/guards/empleadoguard/empleadoguard';
export const routes: Routes = [
    { path: 'inicio', component: Home, pathMatch: 'full' },
  { path: 'pelicula/:id', component: Moviedetails },
  { path: 'candys', component: Homec, pathMatch: 'full' },
  { path: 'registrarse', component: Register, pathMatch: 'full' },
  { path: 'iniciar', component: Login, pathMatch: 'full' },


    { path: 'agregar', component: AgregarPelicula, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  { path: 'crearfuncion', component: CrearFuncionComponent, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  { path: 'validar', component: ValidarEntrada, pathMatch: 'full' , canActivate : [Empleadoguard]},
  { path: 'crear-promos', component: GenerarPromos, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  { path: 'crearcandy', component: CrearCandy, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  { path: 'adminlogs', component: Adminlogs, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  { path: 'adminestadisticas', component: AdminEstadisticas, pathMatch: 'full', canActivate: [AuthAdminGuard] },
  {path: 'modificarpelicula',component : Modificarpelicula,pathMatch : 'full'},
  { path: 'butacas', component: Butacas, pathMatch: 'full' },
  { path: 'butacas/:id', component: Butacas },
  { path: 'preventa', component: PeliculasPreventa },
  { path: 'carrito', component: Carrito, pathMatch: 'full' },
  { path: 'promos', component: Listapromos, pathMatch: 'full' },
  { path: 'usuario', component: Perfilcompras, pathMatch: 'full' },
];
