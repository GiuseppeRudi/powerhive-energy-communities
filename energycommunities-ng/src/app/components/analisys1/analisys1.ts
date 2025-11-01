import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BestModel } from '../../model/BestModel';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';

@Component({
  selector: 'app-analisys1',
  templateUrl: './analisys1.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent],
  styleUrls: ['./analisys1.css']
})
export class Analisys1 implements OnInit {

  bestModel?: BestModel;

  // Mappe per gestire i grafici di ogni membro
  produceChartDataMap: Map<number, ChartData<'line'>> = new Map();
  consumeChartDataMap: Map<number, ChartData<'line'>> = new Map();

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: { legend: { display: true } }
  };

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.planService.getBestModel().subscribe({
      next: (data: BestModel) => {
        this.bestModel = data;
        console.log(this.bestModel);
        this.buildCharts();
      },
      error: err => console.error(err)
    });
  }

  buildCharts() {
    if (!this.bestModel) return;

    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    this.bestModel.assignments.forEach((member) => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');

      // PRODUCERS CHART
      if (producers.length > 0) {
        const labels = Array.from({ length: producers[0].graph.length }, (_, i) => i.toString());
        const datasets = producers.map((p, index) => ({
          label: `Producer ${p.id}`,
          data: p.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }));
        this.produceChartDataMap.set(member.id, { labels, datasets });
      }

      // CONSUMERS CHART
      if (consumers.length > 0) {
        const labels = Array.from({ length: consumers[0].graph.length }, (_, i) => i.toString());
        const datasets = consumers.map((p, index) => ({
          label: `Consumer ${p.id}`,
          data: p.graph,
          borderColor: colors[(index + producers.length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }));
        this.consumeChartDataMap.set(member.id, { labels, datasets });
      }
    });
  }
}
