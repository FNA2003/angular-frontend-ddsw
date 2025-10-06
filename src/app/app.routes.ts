import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { MainPage } from './components/main-page/main-page';
import { AuthGuard } from './interceptors/auth-guard';
import { Logout } from './components/logout/logout';

export const routes: Routes = [
    // Desde index hasta abajo
    {path:"", redirectTo:"home", pathMatch:"full"},

    // Página de inicio, se mostrará para los usuarios no logeados
    {path:"home", component:Home},
    {path:"register", component:Register},
    {path:"login", component:Login},
    
    // COMPONENTES PROTEGIDOS (NECESITAMOS LOGGEARNOS)
    {path:"app", component:MainPage, canActivate:[AuthGuard]},
    {path:"logout", component:Logout, canActivate:[AuthGuard]}
];
