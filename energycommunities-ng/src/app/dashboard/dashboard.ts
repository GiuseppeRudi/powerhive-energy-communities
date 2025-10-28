import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: '../welcome/welcome.css',
  standalone: true
})

export class Dashboard {

  errorMessage = '';
  successMessage = '';
  csvData: string[][] = [];

  // Template di riferimento
  expectedHeader = [
    'id','nome_cognome','category',
    ...Array.from({ length: 24 }, (_, i) => `t${i}`)
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.errorMessage = '';
    this.successMessage = '';
    this.csvData = [];

    if (!file) return;

    // Controllo estensione
    if (!file.name.endsWith('.csv')) {
      this.errorMessage = 'Error: file uploaded must be in format .csv';
      input.value = ''; // reset input
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.trim().split('\n').map(r => r.split(','));

      // Verifica intestazioni
      const header = rows[0].map(h => h.trim());
      const matches =
        header.length === this.expectedHeader.length &&
        header.every((h, i) => h === this.expectedHeader[i]);

      if (!matches) {
        this.errorMessage = 'Error: the file doesn\'t correspond to the given template';
        return;
      }

      this.csvData = rows;
      this.successMessage = 'File uploaded and valid✅';
    };

    reader.onerror = () => {
      this.errorMessage = 'Error during file reading';
    };

    reader.readAsText(file);
  }

  downloadTemplate(): void {
    // Template CSV
    const csvContent = `id,nome_cognome,category,${Array.from({length:24}, (_, i) => `t${i}`).join(',')}`;

    // Creazione blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Creazione link temporaneo e click per download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();

    // Pulizia URL
    URL.revokeObjectURL(url);
  }


}


