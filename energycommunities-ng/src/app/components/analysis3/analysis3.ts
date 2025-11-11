import {Component, Input, OnInit} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { MemberDetail } from '../../model/member/MemberDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { GenerationLoader } from '../generation-loader/generation-loader';
import { HistoryService } from '../../services/history.service';
import {HistorySummary} from '../../model/history/HistorySummary';
import {FormsModule} from '@angular/forms';
import {ResultAnalysis_3} from '../../model/analysis/ResultAnalysis_3';
import {SingleAnalysis} from '../../model/analysis/SingleAnalysis';

@Component({
  selector: 'app-analisys3',
  templateUrl: './analysis3.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule],
  styleUrls: ['./analysis3.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis3 implements OnInit {

  history : HistorySummary | undefined = undefined ;
  resultAnalysis: ResultAnalysis_3 | null = null;
  communityExpandedState: Map<SingleAnalysis, boolean> = new Map();
  optConsProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  optProdProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  totalComparisonChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  kpiChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (0-23)' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  kpiChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (0-23)' } },
      y: { title: { display: true, text: 'Percentage (%)' }, beginAtZero: true, max: 100 }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private analysisService: AnalysisService,
    private authService: AuthService,
    private historyService: HistoryService
  ) {}

  @Input() historyId?: number;
  @Input() members: MemberDetail[] | undefined;
  @Input() wantToRemove: number[] | undefined;
  @Input() wantToAdd: number[] | undefined;

  ngOnInit() {
    this.wantToRemove = [8];
    this.wantToAdd = [1,2];
    this.analysisService.getResultAnalysis_3(this.members,this.wantToAdd,this.wantToRemove).subscribe({
      next: (data) => {
        this.resultAnalysis = data;
        this.communityExpandedState.set(this.resultAnalysis.defaultCommunity, false)
        this.communityExpandedState.set(this.resultAnalysis.optimalCommunity, false)
        this.communityExpandedState.set(this.resultAnalysis.wantedCommunity, false)
        this.buildAllCharts();
      },
      error: (err) => console.error(err)
    });
  }

  toggleCommunity(community: SingleAnalysis) {
    const currentState = this.communityExpandedState.get(community) || false;
    this.communityExpandedState.set(community, !currentState);
  }

  isCommunityExpanded(community: SingleAnalysis): boolean {
    return this.communityExpandedState.get(community) || false;
  }

  isInRemovalList(member: any): boolean {
    return this.wantToRemove?.some(id => id === member.id) ?? false;
  }

  isInAdditionList(member: any): boolean {
    return this.wantToAdd?.some(id => id === member.id) ?? false;
  }

  buildAllCharts() {
    this.buildOptConsProdProfCharts();
    this.buildTotalComparisonChart();
    this.buildKpiChart();
  }

  buildOptConsProdProfCharts() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    let datasetsConsumers: any[] = [];
    let datasetsProducers: any[] = [];

    this.resultAnalysis.defaultCommunity.assignments.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName,
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      if (producer) {
        datasetsProducers.push({
          label: member.fullName,
          data: producer.graph,
          borderColor: colors[(index + member.profiles.filter(p => p.profileType === 'PRODUCER').length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
    });

    this.optConsProfChart.set(this.resultAnalysis.defaultCommunity, { labels, datasets: datasetsConsumers });
    this.optProdProfChart.set(this.resultAnalysis.defaultCommunity, { labels, datasets: datasetsProducers });

    datasetsConsumers = [];
    datasetsProducers = [];

    this.resultAnalysis.optimalCommunity.assignments.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName,
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      if (producer) {
        datasetsProducers.push({
          label: member.fullName,
          data: producer.graph,
          borderColor: colors[(index + member.profiles.filter(p => p.profileType === 'PRODUCER').length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
    });

    this.optConsProfChart.set(this.resultAnalysis.optimalCommunity, { labels, datasets: datasetsConsumers });
    this.optProdProfChart.set(this.resultAnalysis.optimalCommunity, { labels, datasets: datasetsProducers });

    datasetsConsumers = [];
    datasetsProducers = [];

    this.resultAnalysis.wantedCommunity.assignments.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName,
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      if (producer) {
        datasetsProducers.push({
          label: member.fullName,
          data: producer.graph,
          borderColor: colors[(index + member.profiles.filter(p => p.profileType === 'PRODUCER').length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
    });

    this.optConsProfChart.set(this.resultAnalysis.wantedCommunity, { labels, datasets: datasetsConsumers });
    this.optProdProfChart.set(this.resultAnalysis.wantedCommunity, { labels, datasets: datasetsProducers });

  }

  buildTotalComparisonChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.totalComparisonChart.set(this.resultAnalysis.defaultCommunity, {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.defaultCommunity.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.defaultCommunity.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });

    this.totalComparisonChart.set(this.resultAnalysis.optimalCommunity, {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.optimalCommunity.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.optimalCommunity.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });

    this.totalComparisonChart.set(this.resultAnalysis.wantedCommunity, {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.wantedCommunity.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.wantedCommunity.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });
  }

  buildKpiChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.kpiChart.set(this.resultAnalysis.defaultCommunity, {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.defaultCommunity.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.defaultCommunity.kpi2,
          borderColor: 'yellow',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });

    this.kpiChart.set(this.resultAnalysis.optimalCommunity, {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.optimalCommunity.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.optimalCommunity.kpi2,
          borderColor: 'yellow',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });
    this.kpiChart.set(this.resultAnalysis.wantedCommunity, {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.wantedCommunity.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.wantedCommunity.kpi2,
          borderColor: 'yellow',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    });
  }

  getMemberTypeLabel(member: MemberDetail): string {
    const hasProducer = member.profiles.some(p => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles.some(p => p.profileType === 'CONSUMER');

    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }
}

