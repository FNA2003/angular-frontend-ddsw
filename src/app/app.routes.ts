import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { MainPage } from './components/main-page/main-page';

export const routes: Routes = [
    // Desde index hasta abajo
    {path:"", redirectTo:"home", pathMatch:"full"},

    // Página de inicio, se mostrará para los usuarios no logeados
    {path:"home", component:Home},
    {path:"register", component:Register},
    {path:"login", component:Login},
    
    // Página que veremos al logearnos y, de donde accederemos a las invitaciones y demás
    {path:"app", component:MainPage}  
];
