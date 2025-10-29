import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-energy-chart',
  templateUrl: './energy-chart.html',
  styleUrl: './energy-chart.css',
  imports: [BaseChartDirective],
  standalone: true
})
export class EnergyChartComponent {
  @Input() data!: ChartData<any>;
  @Input() options!: ChartOptions<any>;
  @Input() selectedChartType: ChartType = 'line';
}

