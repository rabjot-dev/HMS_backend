import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { EmployeeDashboard } from './pages/employee-dashboard/employee-dashboard';
import { CreateEmployee } from './pages/create-employee/create-employee';
import { ResetPassword } from './pages/reset-password/reset-password';
import { ReceptionistDashboard } from './pages/receptionist-dashboard/receptionist-dashboard';
import { RegisterPatient } from './pages/register-patient/register-patient';
import { BookAppointment } from './pages/book-appointment/book-appointment';
import { ViewAppointments } from './pages/view-appointments/view-appointments';
import { DoctorDashboard } from './pages/doctor-dashboard/doctor-dashboard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
  },

  {
    path: 'create-employee',
    component: CreateEmployee,
  },

  {
    path: 'employee-dashboard',
    component: EmployeeDashboard,
  },

  {
    path: 'reset-password',
    component: ResetPassword
  },
  {
  path: 'receptionist-dashboard',
  component: ReceptionistDashboard,
},

{
  path: 'register-patient',
  component: RegisterPatient,
},

{
  path: 'book-appointment',
  component: BookAppointment,
},

{
  path: 'view-appointments',
  component: ViewAppointments
},

{
  path: 'doctor-dashboard',
  component: DoctorDashboard
}

];