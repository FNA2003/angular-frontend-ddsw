import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Log_in } from './components/login/login';
import { MainPage } from './components/main-page/main-page';
import { AuthGuard } from './interceptors/auth-guard';
import { Logout } from './components/logout/logout';
import { RedirectIfAuthenticatedGuard } from './interceptors/redirect-if-authenticated';

export const routes: Routes = [
    // Desde index hasta abajo
    {path:"", redirectTo:"home", pathMatch:"full"},

    // Página de inicio, se mostrará para los usuarios no logeados
    {path:"home", component:Home, canActivate:[RedirectIfAuthenticatedGuard]},
    {path:"register", component:Register, canActivate:[RedirectIfAuthenticatedGuard]},
    {path:"log_in", component:Log_in, canActivate:[RedirectIfAuthenticatedGuard]},
    
    // COMPONENTES PROTEGIDOS (NECESITAMOS LOGGEARNOS)
    {path:"app", component:MainPage, canActivate:[AuthGuard]},
    {path:"logout", component:Logout, canActivate:[AuthGuard]}
];
