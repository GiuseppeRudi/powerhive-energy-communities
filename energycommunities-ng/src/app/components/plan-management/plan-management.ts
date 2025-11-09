import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../model/User';

import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { ChartData, ChartOptions } from 'chart.js';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-plan-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EnergyChartComponent],
  templateUrl: './plan-management.html',
  styleUrl: './plan-management.css',
})
export class PlanManagement implements OnInit {
  currentUser: User | null = null;
  ownerId: number = 0;
  errorMessage = '';
  successMessage = '';

  memberEmail: string = '';
  memberFullName: string = '';
  memberCategory: 'producer' | 'consumer' | '' = '';
  memberEnergyValues: string = '';

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
  // ---

  constructor(
    private planService: PlanService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser != null) {
        this.ownerId = this.currentUser.id;
      }
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

    if (energyValuesArray.some(isNaN)) {
      this.errorMessage = 'Error: Energy values must be valid numbers.';
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

    this.planService.addMemberToPlan(memberData, this.ownerId).subscribe({
      next: (res) => {
        this.successMessage = `Member "${res.fullName}" saved/updated successfully!`;
        this.authService.setUserField('plan_id', Number(this.currentUser?.id))
        console.log('Member saved:', res);
        this.resetForm();
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
  }
}
