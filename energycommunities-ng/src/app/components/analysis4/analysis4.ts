import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {AnalysisActionsComponent} from '../analysis-save/analysis-save';
import {ClingoEventsService} from '../../services/clingo-events.service';
import {User} from '../../model/User';
import {ResultAnalysis_4} from '../../model/analysis/ResultAnalysis_4';

@Component({
  selector: 'app-analisys4',
  templateUrl: './analysis4.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule, AnalysisActionsComponent],
  styleUrls: ['./analysis4.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis4 implements OnInit,OnDestroy {

  history : HistorySummary | undefined = undefined ;
  typeAnalisys : number = 4
  resultAnalysis: ResultAnalysis_4 | null = null;
  memberExpandedState: Map<number, boolean> = new Map();
  chartDataMap: Map<number, ChartData<'line'>> = new Map();
  optConsProfChart?: ChartData<'line'>;
  optProdProfChart?: ChartData<'line'>;
  totalComparisonChartWBatteries?: ChartData<'line'>;
  totalComparisonChartWOBatteries?: ChartData<'line'>;
  kpiChartWBatteries?: ChartData<'line'>;
  kpiChartWOBatteries?: ChartData<'line'>;

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
      this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
      this.resultAnalysis.assignments = new Map(
        Object.entries(history.state?.result.assignments).map(
          ([key, value]) => [Number(key), value as number]
        )
      );
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
            // this.resultAnalysis = history.analysisData as ResultAnalysis_4;
            // this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
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
        // // Nuova analisi
        // this.typeAnalisys = 0;

        // Se ci sono memberIds nei query params, passali al backend
        // if (memberIdsParam) {
        //   this.memberIds = memberIdsParam.split(',').map((id: string) => +id);
        //   console.log('Running analysis with member IDs:', this.memberIds);

          // Chiama il servizio con i memberIds
          this.analysisService.getResultAnalysis_4().subscribe({
            next: (data) => {
              this.resultAnalysis = data;
              console.log(data);
              this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
              this.resultAnalysis.assignments = new Map(
                Object.entries(data.assignments).map(
                  ([key, value]) => [Number(key), value as number]
                )
              );
              this.buildAllCharts();
            },
            error: (err) => console.error(err)
          });
        // }
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

  hasBattery(memberId: number): boolean {
    return this.resultAnalysis?.assignments?.has(memberId) ?? false;
  }

  getBatteryType(memberId: number): number | null {
    return this.resultAnalysis?.assignments?.get(memberId) ?? null;
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

    this.resultAnalysis.startingCommunity.assignments.forEach(member => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');
      const batteryStatuses = this.resultAnalysis?.batteryStatus;

      let graph: number[] = [];

      if(producers.length != 0) graph = [...producers[0].graph];
      //console.log("Prima " + graph);
      const batteryStatus = batteryStatuses?.find(b => b.memberId == member.id);
      if (batteryStatus) {
        batteryStatus.energyByHour.forEach((value, index) => {
          if(index!=0) {
            const previousStatus = batteryStatus.energyByHour.at(index - 1);
            if (graph) {
              graph[index] = graph[index] - (value - (previousStatus ?? 0));
            }
          }
        });
      }

      //console.log("Dopo " + graph);

      const datasetsProducers = producers.map((p,index) => ({
        label: 'Producer Profile ' + p.id + (batteryStatus != undefined ? " w/ battery" : ""),
        data: p.graph,
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
        tension: 0.25
      }));

      if(producers.length != 0 && batteryStatus != undefined) {
        datasetsProducers.push({
          label: 'Producer Profile ' + producers[0].id + " w/o battery",
          data: graph,
          borderColor: colors[1],
          backgroundColor: 'transparent',
          tension: 0.25
        })
      }

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

    this.resultAnalysis.startingCommunity.assignments.forEach((member, index) => {
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

    this.totalComparisonChartWBatteries = {
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

    this.totalComparisonChartWOBatteries = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.startingCommunity.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.startingCommunity.totalConsumption,
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

    this.kpiChartWBatteries = {
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

    this.kpiChartWOBatteries = {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.startingCommunity.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.startingCommunity.kpi2,
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
      this.resultAnalysis.startingCommunity.assignments = [];
      this.resultAnalysis.startingCommunity.kpi1 = [];
      this.resultAnalysis.startingCommunity.kpi2 = [];
      this.resultAnalysis.startingCommunity.totalConsumption = [];
      this.resultAnalysis.startingCommunity.totalProduction = [];
      this.resultAnalysis.kpi1 = [];
      this.resultAnalysis.kpi2 = [];
      this.resultAnalysis.totalConsumption = [];
      this.resultAnalysis.totalProduction = [];
    }

    this.memberExpandedState.clear();
    this.chartDataMap.clear();
    this.optConsProfChart = undefined;
    this.optProdProfChart = undefined;
    this.totalComparisonChartWBatteries = undefined;
    this.totalComparisonChartWOBatteries = undefined;
    this.kpiChartWBatteries = undefined;
    this.kpiChartWOBatteries = undefined;
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

