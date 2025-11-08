import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { MemberDetail } from '../../model/MemberDetail';
import {ResultAnalysis_1} from '../../model/ResultAnalysis_1';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanService} from '../../services/plan.service';
import {AuthService} from '../../services/auth.service';
import {GenerationLoader} from '../generation-loader/generation-loader';
import {routes} from '../../app.routes';

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

  totalConsumption: number[] = [];
  totalProduction: number[] = [];


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
    private router: Router,
    private planService: PlanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.planService.getBestModel().subscribe({
      next: (data: ResultAnalysis_1) => {
        console.log(data);
        this.members = data.assignments;
        this.kpi1 = data.kpi1;
        this.kpi2 = data.kpi2;
        this.totalConsumption = data.totalConsumption;
        this.totalProduction = data.totalProduction;
        this.members.forEach(member => {
          this.memberExpandedState.set(member.id, false);
        });
        this.buildAllCharts();
      },
      error: err => console.error(err)
    });
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

    this.totalComparisonChart = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.totalConsumption,
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

  saveAnalysis() {
    console.log('Saving analysis...');
    // Qui puoi chiamare un servizio per salvare l'analisi nello storico
    // es: this.planService.saveAnalysis(this.members, this.kpi1, this.kpi2).subscribe(...)
  }

  discardAnalysis() {
    this.resetAnalysisData()
    this.router.navigate(['/dashboard']);

  }

  resetAnalysisData() {
    this.members = [];
    this.kpi1 = [];
    this.kpi2 = [];
    this.totalConsumption = [];
    this.totalProduction = [];

    this.memberExpandedState.clear();
    this.chartDataMap.clear();

    this.optConsProfChart = undefined;
    this.optProdProfChart = undefined;
    this.totalComparisonChart = undefined;
    this.kpiChart = undefined;

  }

}
