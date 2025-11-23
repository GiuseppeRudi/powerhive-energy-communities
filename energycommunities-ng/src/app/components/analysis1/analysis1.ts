import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { MemberDetail } from '../../model/member/MemberDetail';
import { ResultAnalysis_1 } from '../../model/analysis/ResultAnalysis_1';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { GenerationLoader } from '../generation-loader/generation-loader';
import { HistoryService } from '../../services/history.service';
import { User } from '../../model/User';
import { SaveAnalysisRequest } from '../../model/SaveAnalysisRequest';
import {HistoryDetail} from '../../model/history/HistoryDetail';
import {HistorySummary} from '../../model/history/HistorySummary';
import {FormsModule} from '@angular/forms';
import {ClingoEventsService} from '../../services/clingo-events.service';
import {AnalysisActionsComponent} from '../analysis-save/analysis-save';

@Component({
  selector: 'app-analisys1',
  templateUrl: './analysis1.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule, AnalysisActionsComponent],
  styleUrls: ['./analysis1.css', '../welcome/welcome.css']
})
export class Analysis1 implements OnInit,OnDestroy {

  history : HistorySummary | undefined = undefined ;
  typeAnalisys : number = 1
  resultAnalysis: ResultAnalysis_1 | null = null;
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

  statusMessage = "Starting...";
  statusWarning: boolean = false;

  memberIds: number[] | undefined = undefined;

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private analysisService: AnalysisService,
    private authService: AuthService,
    private historyService: HistoryService,
    private clingoEvents: ClingoEventsService
  ) {}


  ngOnInit() {
    this.resultAnalysis = history.state?.result ?? null;

    if(this.resultAnalysis != null) {
      this.typeAnalisys = 0;
      this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
      this.buildAllCharts();
      return;
    }

    this.route.queryParams.subscribe(params => {
      const historyId = +params['historyId'];
      const memberIdsParam = params['memberIds'];

      if (historyId) {
        // Caricamento da history (come prima)
        this.historyService.getHistoryById(historyId).subscribe({
          next: history => {
            this.history = history;
            this.resultAnalysis = history.analysisData as ResultAnalysis_1;
            this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
            this.buildAllCharts();
          },
          error: err => console.error('Errore caricamento history:', err)
        });
      } else {
        this.clingoEvents.connect((eventName,analysisId) => {
          console.log(eventName);
          console.log(analysisId);
          if (analysisId == -1) {
            if (eventName === 'GROUNDING_STARTED') {
              this.statusMessage = 'Grounding...';
            }
            if (eventName === 'GROUNDING_FINISHED') {
              this.statusMessage = 'Solving...';
              if (this.statusWarning) this.statusWarning = false
            }
            if (eventName === 'GROUNDING_STILL_RUNNING') {
              this.statusWarning = true
            }
          }
        });
        // Nuova analisi
        this.typeAnalisys = 0;

        // Se ci sono memberIds nei query params, passali al backend
        if (memberIdsParam) {
          this.memberIds = memberIdsParam.split(',').map((id: string) => +id);
          console.log('Running analysis with member IDs:', this.memberIds);

          // Chiama il servizio con i memberIds
          this.analysisService.getResultAnalysis_1(this.memberIds).subscribe({
            next: (data) => {
              this.resultAnalysis = data;
              this.resultAnalysis.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
              this.buildAllCharts();
            },
            error: (err) => console.error(err)
          });
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.clingoEvents) this.clingoEvents.disconnect();
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

    this.resultAnalysis.assignments.forEach(member => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');

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

      this.chartDataMap.set(member.id, { labels, datasets: [...datasetsProducers, ...datasetsConsumers] });
    });
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

  runAnalysisAsync() {
    const memberIds = this.memberIds;
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);
    this.analysisService.runAsync1(user.id, 1, memberIds).subscribe(id => {
      this.router.navigate(['/ongoing-analysis']);
    });
  }
}
