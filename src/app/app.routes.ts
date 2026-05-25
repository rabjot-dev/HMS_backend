import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { User } from './user/user';
import { Profile } from './profile/profile';
import { ResetPasswordComponent } from './reset-password/reset-password';    
import { AdminHome } from './admin-home/admin-home';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Home } from './home/home';
import { RegistrationRequests } from './registration-requests/registration-requests';
import { AddPatient } from './add-patient/add-patient';
import { PatientDashboard } from './patient-dashboard/patient-dashboard';
import { ReceptionistHome } from './receptionist-home/receptionist-home';
import { BookAppointment } from './book-appointment/book-appointment';
import { ViewAppointments } from './view-appointments/view-appointments';



export const routes: Routes = [
    {path:'login', component:Login},
    {path:'signup', component:Signup},
    {path:'user',component:User},
    { path: 'profile', component: Profile },
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'admin', component: AdminHome },
    { path: 'admin-dashboard', component: AdminDashboard },
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'registration-requests', component: RegistrationRequests },
    { path: 'add-patient', component: AddPatient },
    { path: 'patient-dashboard', component: PatientDashboard },
    { path: 'receptionist', component: ReceptionistHome },
    { path: 'book-appointment', component: BookAppointment },
    { path: 'view-appointments', component: ViewAppointments },

];
