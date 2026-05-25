import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-receptionist-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    PageHeader
  ],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.css',
})

export class ReceptionistDashboard {}