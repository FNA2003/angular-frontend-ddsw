import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { Login } from './components/login/login';
import { MainPage } from './components/main-page/main-page';

export const routes: Routes = [
    {path:"", component:Home},             // Página de inicio, se mostrará para los usuarios no logeados
    {path:"register", component:Register},
    {path:"login", component:Login},
    
    {path:"mainPage", component:MainPage}  // Página que veremos al logearnos y, de donde accederemos a las invitaciones y demás
];
