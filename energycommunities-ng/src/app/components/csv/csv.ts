import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService} from '../../services/plan.service';
import { AuthService} from '../../services/auth/auth.service';
import {User} from '../../model/User';
import {PlanSummary} from '../../model/plan/PlanSummary';

@Component({
  selector: 'app-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv.html',
  styleUrls: ['../welcome/welcome.css'],
})
export class Csv implements OnInit {
  currentUser : User | null = null;

  constructor(private planService: PlanService, private router: Router, private authService : AuthService) {}

  ownerId: number = 0;
  errorMessage = '';
  successMessage = '';
  csvData: string[][] = [];
  profiles: any[] = [];
  selectedFile: File | null = null;

  ngOnInit() {

    this.authService.user$.subscribe(user => this.currentUser = user);

    if(this.currentUser != null) {
      this.ownerId = this.currentUser.id;
    }

  }

  expectedHeader = [
    'id', 'full_name', 'email', 'category',
    ...Array.from({ length: 24 }, (_, i) => `t${i}`)
  ];


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.csvData = [];
    this.profiles = [];

    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      this.errorMessage = 'Error: file uploaded must be in format .csv';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.trim().split('\n').map(r => r.split(','));
      const header = rows[0].map(h => h.trim());

      const matches =
        header.length === this.expectedHeader.length &&
        header.every((h, i) => h === this.expectedHeader[i]);

      if (!matches) {
        this.errorMessage = 'Error: the file doesn\'t correspond to the given template';
        return;
      }

      this.csvData = rows;
      this.selectedFile = file;

      // Crea oggetti profilo
      this.profiles = rows.slice(1).map(r => ({
        nome_cognome: r[1],
        email: r[2],
        category: r[3] as 'producer' | 'consumer',
        energyValues: r.slice(4).map(Number)
      }));

      this.successMessage = 'File uploaded and valid ';
    };

    reader.onerror = () => {
      this.errorMessage = 'Error during file reading';
    };

    reader.readAsText(file);
  }

  downloadTemplate(): void {
    const csvContent = `id,full_name,email,category,${Array.from({ length: 24 }, (_, i) => `t${i}`).join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  saveCsv(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'No file selected';
      return;
    }


    this.planService.uploadCsv(this.selectedFile, this.ownerId).subscribe({
      next: (res) => {
        this.successMessage = res;
        console.log(this.successMessage);
        this.authService.setUserField('plan_id', Number(this.successMessage))
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Error uploading file: ' + (err.error || err.message);
      }
    });
  }
}
