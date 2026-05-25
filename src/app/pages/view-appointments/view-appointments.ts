import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-view-appointments',
  imports: [CommonModule, FormsModule, PageHeader],
  templateUrl: './view-appointments.html',
  styleUrl: './view-appointments.css',
})
export class ViewAppointments implements OnInit {

  appointments: any[] = [];

  editingId = '';

  editData: any = {
    appointmentDate: '',
    timeSlot: '',
    reason: '',
    status: '',
  };

  constructor(
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (res: any) => {
        this.appointments = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("APPOINTMENT FETCH ERROR:", err);
      }
    });
  }

  startEdit(app: any) {
    this.editingId = app._id;

    this.editData = {
      appointmentDate: app.appointmentDate?.substring(0, 10),
      timeSlot: app.timeSlot,
      reason: app.reason,
      status: app.status,
    };
  }

  cancelEdit() {
    this.editingId = '';
  }

  updateAppointment(id: string) {
    this.appointmentService.updateAppointment(id, this.editData).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.editingId = '';
        this.getAppointments();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }

  deleteAppointment(id: string) {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    this.appointmentService.deleteAppointment(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.getAppointments();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}