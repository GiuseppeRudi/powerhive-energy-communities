import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
// import { mockPlan, kpi1, kpi2, calculateTotals } from '../../model/mock';
import { MemberDetail } from '../../model/MemberDetail';
import {BestModel} from '../../model/BestModel';
import {ActivatedRoute} from '@angular/router';
import {PlanService} from '../../services/plan.service';
import {AuthService} from '../../services/auth.service';
import {GenerationLoader} from '../generation-loader/generation-loader';

@Component({
  selector: 'app-analisys1',
  templateUrl: './analisys1.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader],
  styleUrls: ['./analisys1.css', '../welcome/welcome.css']
})
export class Analisys1 implements OnInit {

  members: MemberDetail[] = [];
  kpi1: number[] = [];
  kpi2: number[] = [];

  // per lo stato aperto/chiuso dei membri
  memberExpandedState: Map<number, boolean> = new Map();

  chartDataMap: Map<number, ChartData<'line'>> = new Map();
  optConsProfChart?: ChartData<'line'>;
  optProdProfChart?: ChartData<'line'>;
  totalComparisonChart?: ChartData<'line'>;
  kpiChart?: ChartData<'line'>;

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {title: {display: true, text: 'Hour (0-23)'}},
      y: {title: {display: true, text: 'Energy (kWh)'},beginAtZero: true,}
    },
    plugins: {
      legend: {display: true, position: 'top'},
      tooltip: {enabled: true, mode: 'index', intersect: false}
    }
  };

  kpiChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {title: {display: true, text: 'Hour (0-23)'}},
      y: {
        title: {display: true, text: 'Percentage (%)'},
        beginAtZero: true,
        max: 100,
      }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.planService.getBestModel().subscribe({
      next: (data: BestModel) => {
        console.log(data);
        this.members = data.assignments;
        this.kpi1 = data.kpi1;
        this.kpi2 = data.kpi2;
        this.members.forEach(member => {
          this.memberExpandedState.set(member.id, false);
        });
        this.buildAllCharts();
      },
      error: err => console.error(err)
    });
    /*
    this.members = mockPlan.members;

    // Inizializza tutti i membri come chiusi
    this.members.forEach(member => {
      this.memberExpandedState.set(member.id, false);
    });

    this.buildAllCharts();
    */
  }

  toggleMember(memberId: number) {
    const currentState = this.memberExpandedState.get(memberId) || false;
    this.memberExpandedState.set(memberId, !currentState);
  }

  isMemberExpanded(memberId: number): boolean {
    return this.memberExpandedState.get(memberId) || false;
  }

  buildAllCharts() {
    this.buildMemberCharts();
    this.buildOptConsProdProfChart();
    this.buildTotalComparisonChart();
    this.buildKpiChart();
  }

  buildMemberCharts() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    this.members.forEach((member) => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');

      if (producers.length > 0 || consumers.length > 0) {
        const datasetsProducers = producers.map((p, index) => ({
          label: 'Producer Profile ' + p.id,
          data: p.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }));
        const datasetsConsumers = consumers.map((p, index) => ({
          label: 'Consumer Profile ' + p.id,
          data: p.graph,
          borderColor: colors[(index + producers.length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }));
        const datasets = datasetsProducers.concat(datasetsConsumers);
        this.chartDataMap.set(member.id, { labels, datasets });
      }
    });
  }

  buildOptConsProdProfChart() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    const datasetsConsumers: any[] = [];
    const datasetsProducers: any[] = [];

    this.members.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName + ' Profile',
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      if (producer) {
        datasetsProducers.push({
          label: member.fullName + ' Profile',
          data: producer.graph,
          borderColor: colors[(index + member.profiles.filter(p => p.profileType == "PRODUCER").length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
    });

    this.optConsProfChart = {
      labels,
      datasets: datasetsConsumers
    };

    this.optProdProfChart = {
      labels,
      datasets: datasetsProducers
    };
  }

  buildTotalComparisonChart() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const { totalProduction, totalConsumption } = this.calculateTotalsConsProd();

    this.totalComparisonChart = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };
  }

  buildKpiChart() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    if(this.kpi1!=null && this.kpi2!=null) {
      this.kpiChart = {
        labels,
        datasets: [
          {
            label: 'Shared Energy (KPI1)',
            data: this.kpi1,
            borderColor: 'blue',
            backgroundColor: 'transparent',
            tension: 0.25,
          },
          {
            label: 'Self-Sufficiency (KPI2)',
            data: this.kpi2,
            borderColor: 'yellow',
            backgroundColor: 'transparent',
            tension: 0.25,
          }
        ]
      };
    }
  }

  getMemberTypeLabel(member: MemberDetail): string {
    const hasProducer = member.profiles.some(p => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles.some(p => p.profileType === 'CONSUMER');

    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }

  calculateTotalsConsProd() {
    const totalProduction = new Array(24).fill(0);
    const totalConsumption = new Array(24).fill(0);

    this.members.forEach(member => {
      member.profiles.forEach(profile => {
        if (profile.profileType === 'PRODUCER') {
          profile.graph.forEach((value, hour) => {
            totalProduction[hour] += value;
          });
        } else if (profile.profileType === 'CONSUMER') {
          profile.graph.forEach((value, hour) => {
            totalConsumption[hour] += value;
          });
        }
      });
    });

    return { totalProduction, totalConsumption };
  }
}
