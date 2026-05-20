import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { User } from './user/user';
import { Profile } from './profile/profile';
import { ResetPasswordComponent } from './reset-password/reset-password';    
import { AdminHome } from './admin-home/admin-home';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
export const routes: Routes = [
    {path:'login', component:Login},
    {path:'signup', component:Signup},
    {path:'user',component:User},
    { path: 'profile', component: Profile },
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'admin', component: AdminHome },
     { path: 'admin-dashboard', component: AdminDashboard }

];
