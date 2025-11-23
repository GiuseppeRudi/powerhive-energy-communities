import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../model/User';

import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { ChartData, ChartOptions } from 'chart.js';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanSummary } from '../../model/plan/PlanSummary';
import { BatteryService } from '../../services/battery.service';
import { BatteryDto } from '../../model/battery/BatteryDto';

@Component({
  selector: 'app-plan-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EnergyChartComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './plan-management.html',
  styleUrls: ['./plan-management.css', '../welcome/welcome.css']
})
export class PlanManagement implements OnInit {
  currentUser: User | null = null;
  plan?: PlanSummary;
  ownerId: number = 0;
  errorMessage = '';
  successMessage = '';

  memberEmail: string = '';
  memberFullName: string = '';
  memberCategory: 'producer' | 'consumer' | '' = '';
  memberEnergyValues: string = '';

  plan_batteries: BatteryDto[] = []

  previewChartData: ChartData<'line'> | null = null;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (t0 - t23)' } },
      y: { title: { display: true, text: 'Energy Value' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  management_navbar_state: ManagementNavbarState = ManagementNavbarState.MEMBERS
  public ManagementNavbarState = ManagementNavbarState;

  constructor(
    private planService: PlanService,
    private router: Router,
    private authService: AuthService,
    private batteryService: BatteryService
  ) { }
  isDeleteModalVisible = false;
  memberToDelete: { id: number, fullName: string } | null = null;
  
  isBatteryDeleteModalVisible = false;
  batteryToDelete: BatteryDto | null = null;

  set_navbar_state(state: ManagementNavbarState): void {
    this.management_navbar_state = state
  }

  private form_builder = inject(FormBuilder)
  battery_form: FormGroup = this.form_builder.group({
    model: ['', Validators.required],
    capacity: ['', Validators.required],
    price: ['', Validators.required]
  })

  submit_battery() {
    if (this.battery_form.invalid) {
      this.battery_form.markAllAsTouched();
      return;
    }

    const new_battery: BatteryDto = {
      id: null,
      plan: this.plan!,
      model: this.battery_form.value.model,
      capacity: this.battery_form.value.capacity,
      price: this.battery_form.value.price
    }

    this.batteryService.add_battery(this.plan!.id, new_battery).subscribe({
      next: (response) => {
        this.battery_form.reset();

        this.batteryService.get_batteries_by_plan(this.currentUser!.plan_id)
          .subscribe(batteries => {
            this.plan_batteries = batteries;
          });
      }
    });

    console.log(this.plan_batteries)
  }

  delete_battery(battery: BatteryDto) {
    this.batteryService.delete_battery(battery.id!).subscribe({
      next: (response) => {
        this.batteryService.get_batteries_by_plan(this.currentUser!.plan_id)
          .subscribe(response => { this.plan_batteries = response });
      }
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.ownerId = this.currentUser.id;
        if (this.currentUser.plan_id) {
          this.loadPlan(this.currentUser.plan_id);

          this.batteryService.get_batteries_by_plan(this.currentUser.plan_id).subscribe(response => {
            this.plan_batteries = response;
          })
        }
      }
    });
  }

  loadPlan(planId: number): void {
    this.planService.getSummaryPlan(planId).subscribe({
      next: (plan: PlanSummary) => {
        this.plan = plan;
        console.log('Plan loaded:', this.plan);
      },
      error: (error: Error) => {
        console.error('Error loading plan:', error);
        this.errorMessage = 'Could not load existing plan details.';
      },
    });
  }

  updatePreviewChart(): void {
    if (!this.memberCategory || !this.memberEnergyValues) {
      this.previewChartData = null;
      return;
    }

    const energyValuesArray = this.memberEnergyValues
      .trim()
      .split(/[\s,]+/)
      .filter(v => v !== '');

    const parsedValues: number[] = [];
    for (const val of energyValuesArray) {
      const num = Number(val);
      if (isNaN(num)) {
        break;
      }
      parsedValues.push(num);
    }

    if (parsedValues.length === 0) {
      this.previewChartData = null;
      return;
    }

    const label = this.memberCategory === 'producer' ? 'Production Preview' : 'Consumption Preview';
    const color = this.memberCategory === 'producer' ? '#4caf50' : '#f44336';

    this.previewChartData = {
      labels: parsedValues.map((_, i) => `t${i}`),
      datasets: [{
        label: label,
        data: parsedValues,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.25
      }]
    };


    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }

  saveMember(): void {
    window.scrollTo(0, 0);

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.memberEmail || !this.memberFullName || !this.memberCategory || !this.memberEnergyValues) {
      this.errorMessage = 'Error: All fields are required.';
      return;
    }

    if (this.ownerId === 0) {
      this.errorMessage = 'Error: User not authenticated. Cannot save.';
      return;
    }

    const energyValuesArray = this.memberEnergyValues
      .trim()
      .split(/[\s,]+/)
      .filter(v => v !== '')
      .map(Number);

    if (energyValuesArray.some(value => isNaN(value) || !Number.isInteger(Number(value)))) {
      this.errorMessage = 'Error: Energy values must be valid integers.';
      return;
    }


    if (energyValuesArray.length !== 24) {
      this.errorMessage = `Error: Exactly 24 energy values are required. You provided ${energyValuesArray.length}.`;
      return;
    }

    const memberData = {
      full_name: this.memberFullName,
      email: this.memberEmail,
      category: this.memberCategory,
      energyValues: energyValuesArray
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.memberEmail || !emailRegex.test(this.memberEmail)) {
      this.errorMessage = 'Errore: Inserisci un indirizzo email valido.';
      return; // Blocca l'esecuzione
    }

    this.planService.addMemberToPlan(memberData, this.ownerId).subscribe({
      next: (res) => {
        this.successMessage = `Member "${res.fullName}" saved/updated successfully!`;
        console.log('Member saved, response from backend:', res);
        this.resetForm();
        const planId = res.plan_id;

        if (planId) {
          console.log("Sono qua (ID dalla risposta API):", planId);
          this.authService.setUserField('plan_id', planId);
          this.loadPlan(planId);
          if (this.currentUser) {
            this.currentUser.plan_id = planId;
          }

        } else {
          if (this.currentUser?.plan_id) {
            console.log("Sono qua (ID dallo stato corrente)");
            this.loadPlan(this.currentUser.plan_id);
          } else {
            console.error("Membro salvato, ma nessun plan_id ricevuto o presente.");
            this.errorMessage = "Member saved, but unable to reload plan. Please refresh the page.";
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Conflict: The email ${this.memberEmail} is already associated with an account. Update the member with new production/consumption profiles.`;
      }
    });
  }

  resetForm(): void {
    this.memberEmail = '';
    this.memberFullName = '';
    this.memberCategory = '';
    this.memberEnergyValues = '';
    this.previewChartData = null;
  }

  loadMemberForEdit(member: any): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.errorMessage = '';
    this.successMessage = '';

    this.memberFullName = member.fullName;

    this.memberEmail = member.email;

    this.memberCategory = '';
    this.memberEnergyValues = '';
    this.previewChartData = null;

  }

  openDeleteModal(member: { id: number, fullName: string }): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.memberToDelete = member;
    this.isDeleteModalVisible = true;
  }

  // Open battery delete confirmation
  openBatteryDeleteModal(battery: BatteryDto): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.batteryToDelete = battery;
    this.isBatteryDeleteModalVisible = true;
  }

  closeBatteryDeleteModal(): void {
    this.isBatteryDeleteModalVisible = false;
    this.batteryToDelete = null;
  }

  confirmBatteryDelete(): void {
    if (!this.batteryToDelete) {
      this.errorMessage = 'Error: no battery selected for deletion.';
      this.closeBatteryDeleteModal();
      return;
    }

    const batteryId = this.batteryToDelete.id;
    this.errorMessage = '';
    this.successMessage = '';

    if (!batteryId) {
      this.errorMessage = 'Error: invalid battery id.';
      this.closeBatteryDeleteModal();
      return;
    }

    this.batteryService.delete_battery(batteryId).subscribe({
      next: () => {
        this.successMessage = 'Battery successfully deleted!';
        if (this.currentUser?.plan_id) {
          this.batteryService.get_batteries_by_plan(this.currentUser.plan_id).subscribe(response => {
            this.plan_batteries = response;
          });
        }
        this.closeBatteryDeleteModal();
      },
      error: (err: any) => {
        console.error('Error while deleting battery:', err);
        this.errorMessage = 'Error during battery deletion. Please try again later.';
        this.closeBatteryDeleteModal();
      }
    });
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.memberToDelete = null;
  }

  confirmDelete(): void {
    if (!this.memberToDelete) {
      this.errorMessage = 'Error: no member selected for deletion.';
      this.closeDeleteModal();
      return;
    }

    const memberId = this.memberToDelete.id;
    this.errorMessage = '';
    this.successMessage = '';

    console.log(`Deletion request for member with ID: ${memberId}`);


    if (!this.ownerId || this.ownerId === 0) {
      this.errorMessage = 'Error: user not authenticated. Deletion failed.';
      this.closeDeleteModal();
      return;
    }

    this.planService.deleteMemberFromPlan(memberId, this.ownerId).subscribe({
      next: () => {
        this.successMessage = 'Member successfully deleted!';
        if (typeof this.loadPlan === 'function') {
          if (this.currentUser?.plan_id) {
            this.loadPlan(this.currentUser.plan_id);
          }
        } else {
          console.warn('Method loadPlan() not found. The table will not update automatically.');
        }

        this.closeDeleteModal();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error while deleting member:', err);

        let detail = err.error?.message || 'Please try again later.';
        if (err.status === 404) {
          detail = 'Member or plan not found.';
        } else if (err.status === 401 || err.status === 403) {
          detail = 'You do not have permission to perform this action.';
        }

        this.errorMessage = `Error during deletion.${detail}`;
        this.closeDeleteModal();
      }
    });
  }
}

export enum ManagementNavbarState {
  MEMBERS,
  BATTERIES
}
