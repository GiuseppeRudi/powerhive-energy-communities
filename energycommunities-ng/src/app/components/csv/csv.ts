import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { EnergyChartComponent } from '../energy-chart/energy-chart';

@Component({
  selector: 'app-csv',
  standalone: true,
  imports: [RouterLink, CommonModule, EnergyChartComponent],
  templateUrl: './csv.html',
  styleUrl: '../../welcome/welcome.css'
})
export class Csv {
  errorMessage = '';
  successMessage = '';
  csvData: string[][] = [];
  profiles: any[] = [];

  expectedHeader = [
    'id', 'full_name', 'email', 'category',
    ...Array.from({ length: 24 }, (_, i) => `t${i}`)
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
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

      // Crea oggetti profilo
      this.profiles = rows.slice(1).map(r => ({
        nome_cognome: r[1],
        email: r[2],
        category: r[3] as 'producer' | 'consumer',
        energyValues: r.slice(4).map(Number)
      }));

      this.successMessage = 'File uploaded and valid ✅';
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

  getChartData(profile: any): ChartData<'line'> {
    const isProducer = profile.category === 'producer';
    const color = isProducer ? 'green' : 'red';
    const label = isProducer ? 'Produced Energy' : 'Consumed Energy';

    return {
      labels: Array.from({ length: 24 }, (_, i) => i.toString()),
      datasets: [{
        label,
        data: profile.energyValues,
        borderColor: color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.25
      }]
    };
  }

  chartOptions: ChartOptions<any> = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Hours' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: { legend: { display: true } }
  };
}
