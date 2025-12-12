import {Component, OnInit} from '@angular/core';
import {MemberSummary} from '../../model/member/MemberSummary';
import {ActivatedRoute, Router} from '@angular/router';
import {AnalysisService} from '../../services/analysis.service';
import {AuthService} from '../../services/auth/auth.service';
import {mockPlan} from '../../model/mock/mock';
import {ResultAnalysis_2} from '../../model/analysis/ResultAnalysis_2';
import {GenerationLoader} from '../generation-loader/generation-loader';
import {FormsModule} from '@angular/forms';
import {EnergyChartComponent} from '../energy-chart/energy-chart';
import {ChartData, ChartOptions} from 'chart.js';
import {MemberDetail} from '../../model/member/MemberDetail';
import {NgForOf, NgIf} from '@angular/common';
import {User} from '../../model/User';
import {SaveAnalysisRequest} from '../../model/SaveAnalysisRequest';
import {AnalysisActionsComponent} from '../analysis-save/analysis-save';
import {HistorySummary} from '../../model/history/HistorySummary';
import {ResultAnalysis_1} from '../../model/analysis/ResultAnalysis_1';
import {HistoryService} from '../../services/history.service';


@Component({
  selector: 'app-analysis2',
  templateUrl: './analysis2.html',
  standalone: true,
  imports: [GenerationLoader, FormsModule, EnergyChartComponent, NgForOf, NgIf, AnalysisActionsComponent],
  styleUrls: ['./analysis2.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis2 implements OnInit{
  history : HistorySummary | undefined = undefined ;
  typeAnalisys : number = 2;
  members: MemberSummary[] = [];
  isLoading = false;
  resultAnalysis: ResultAnalysis_2 | null = null;
  memberExpandedState: Map<number, boolean> = new Map();
  chartDataMap: Map<number, ChartData<'line'>> = new Map();
  optConsProfChart?: ChartData<'line'>;
  optProdProfChart?: ChartData<'line'>;
  totalComparisonChart?: ChartData<'line'>;
  kpiChart?: ChartData<'line'>;
  summary: {
    totalProduction: number;
    totalConsumption: number;
    sharedEnergy: number;
    efficiency: number;
  } | null = null;
  communityCompositionChart: ChartData<'pie'> | undefined;

  chartOptionsLine: ChartOptions<'line'> = {
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

  chartOptionsPie: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
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
      y: { title: { display: true, text: 'Percentage (%)' }, beginAtZero: true, suggestedMax: 100 }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  constructor(private router: Router,
              private route : ActivatedRoute,
              private analysisService: AnalysisService,
              private historyService: HistoryService,
              private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;

    this.resultAnalysis = history.state?.result ?? null;

    if(this.resultAnalysis != null) {
      this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
      this.summary = this.calculateEnergyStats(this.resultAnalysis.totalProduction, this.resultAnalysis.totalConsumption);
      this.buildAllCharts();
      this.isLoading = false;
      return;
    }

    this.route.queryParams.subscribe(params => {
      const historyId = +params['historyId'];

      if (historyId) {
        this.historyService.getHistoryById(historyId).subscribe({
          next: history => {
            this.history = history;
            this.resultAnalysis = history.analysisData as ResultAnalysis_2;

            if (this.resultAnalysis) {
              this.members = this.resultAnalysis?.assignments
              this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
              this.summary = this.calculateEnergyStats(this.resultAnalysis.totalProduction, this.resultAnalysis.totalConsumption);
              this.buildAllCharts();
              this.isLoading = false;
            }
          },
          error: err => console.error('Errore caricamento history:', err)
        });
      } else {
        const body : any = this.analysisService.getAnalysisResult();

        this.analysisService.getResultAnalysis_2(body).subscribe({
          next: (result) => {
            console.log('Analisi completata:', result);
            this.resultAnalysis = result;

            if (this.resultAnalysis) {
              this.members = this.resultAnalysis?.assignments
              this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
              this.summary = this.calculateEnergyStats(this.resultAnalysis.totalProduction, this.resultAnalysis.totalConsumption);
              this.buildAllCharts();
              this.isLoading = false;
            }
          },
          error: (err) => {
            console.error('Errore durante la richiesta:', err);
            alert('Si è verificato un errore durante l\'analisi. Riprova più tardi.');
          }
        });

      }
    });


  }

  calculateEnergyStats(production: number[], consumption: number[]) {
    if (production.length !== consumption.length) {
      throw new Error('Production and consumption arrays must have the same length');
    }

    let totalProduction = 0;
    let totalConsumption = 0;
    let sharedEnergy = 0;

    for (let i = 0; i < production.length; i++) {
      const p = production[i];
      const c = consumption[i];

      totalProduction += p;
      totalConsumption += c;
      sharedEnergy += Math.min(p, c);
    }

    const efficiency = totalProduction > 0 ? sharedEnergy / totalProduction * 100 : 0;

    return {
      totalProduction,
      totalConsumption,
      sharedEnergy,
      efficiency,
    };
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
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    var numP = 0;
    var numC = 0;

    this.resultAnalysis.assignments.forEach(member => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');

      const datasetsProducers = producers.map((p, index) => ({
        label: 'Producer Profile',
        data: p.graph,
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
        tension: 0.25
      }));

      const datasetsConsumers = consumers.map((p, index) => ({
        label: 'Consumer Profile',
        data: p.graph,
        borderColor: colors[(index + producers.length) % colors.length],
        backgroundColor: 'transparent',
        tension: 0.25
      }));

      this.chartDataMap.set(member.id, { labels, datasets: [...datasetsProducers, ...datasetsConsumers] });
      numP+=producers.length;
      numC+=consumers.length;
    });
    this.communityCompositionChart = {
      labels: ['Producers', 'Consumers'],
      datasets: [
        {
          data: [numP, numC],
          backgroundColor: ['green', 'yellow']
        }
      ]
    };
  }

  buildOptConsProdProfChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    const datasetsConsumers: any[] = [];
    const datasetsProducers: any[] = [];

    this.resultAnalysis.assignments.forEach((member, index) => {
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

    this.optConsProfChart = { labels, datasets: datasetsConsumers };
    this.optProdProfChart = { labels, datasets: datasetsProducers };
  }

  buildTotalComparisonChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.totalComparisonChart = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };
  }


  resetAnalysisData() {
    if (this.resultAnalysis) {
      this.resultAnalysis.assignments = [];
      this.resultAnalysis.kpi1 = [];
      this.resultAnalysis.kpi2 = [];
      this.resultAnalysis.totalConsumption = [];
      this.resultAnalysis.totalProduction = [];
    }

    this.memberExpandedState.clear();
    this.chartDataMap.clear();
    this.optConsProfChart = undefined;
    this.optProdProfChart = undefined;
    this.totalComparisonChart = undefined;
    this.kpiChart = undefined;
  }

  buildKpiChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.kpiChart = {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.kpi2,
          borderColor: 'orange',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };
  }

  getMemberTypeLabel(member: MemberDetail): string {
    const hasProducer = member.profiles.some(p => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles.some(p => p.profileType === 'CONSUMER');

    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }
}

