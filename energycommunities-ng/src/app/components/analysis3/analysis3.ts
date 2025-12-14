import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { MemberDetail } from '../../model/member/MemberDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { GenerationLoader } from '../generation-loader/generation-loader';
import { HistoryService } from '../../services/history.service';
import { HistorySummary } from '../../model/history/HistorySummary';
import { FormsModule } from '@angular/forms';
import { ResultAnalysis_3 } from '../../model/analysis/ResultAnalysis_3';
import { SingleAnalysis } from '../../model/analysis/SingleAnalysis';
import { Analysis3Request } from '../../model/analysis/Analysis3Request';
import { AnalysisActionsComponent } from '../analysis-save/analysis-save';
import { CommunityData } from '../../model/CommunityData';

@Component({
  selector: 'app-analisys3',
  templateUrl: './analysis3.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule, AnalysisActionsComponent],
  styleUrls: ['./analysis3.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis3 implements OnInit {

  history: HistorySummary | undefined = undefined;
  resultAnalysis: ResultAnalysis_3 | null = null;
  communityExpanded: SingleAnalysis | null = null;

  communities: CommunityData[] = [];

  // Grafici esistenti per singola community
  optConsProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  optProdProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  totalComparisonChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  kpiChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();

  // Grafici Globali
  globalKpiChartData: ChartData<'line'> | undefined;
  globalProdConsChartData: ChartData<'line'> | undefined;

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Hour (0-23)' },
        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
      },
      y: {
        title: { display: true, text: 'Energy (kWh)' },
        beginAtZero: true,
        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
      }
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
      x: {
        title: { display: true, text: 'Hour (0-23)' },
        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
      },
      y: {
        title: { display: true, text: 'Percentage (%)' },
        beginAtZero: true,
        suggestedMax: 100,
        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' }
      }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private analysisService: AnalysisService,
    private authService: AuthService,
    private historyService: HistoryService
  ) { }

  typeAnalysis: number = 3;
  historyId: number | null = null;
  members: MemberDetail[] | undefined;
  wantToRemove: number[] | undefined;
  removedMembers: MemberDetail[] = [];
  wantToAdd: number[] | undefined;
  addedMembers: MemberDetail[] = [];
  analysis3Request: Analysis3Request | undefined = undefined;


  ngOnInit() {
    // 1. Tenta di recuperare i dati passati via Router (dal componente precedente)
    this.resultAnalysis = history.state?.result ?? null;

    if (this.resultAnalysis != null) {
      this.wantToRemove = history.state?.wantToRemove;
      this.wantToAdd = history.state?.wantToAdd;
      this.members = this.resultAnalysis.defaultCommunity.assignments;

      if (this.members && this.wantToRemove) {
        this.removedMembers = this.wantToRemove
          .map(id => this.members!.find(m => m.id === id))
          .filter((m): m is MemberDetail => m !== undefined);
      }
      this.setupCommunities();
      this.buildAllCharts();
      return;
    }

    // 2. Se non ci sono dati nello state, controlla i queryParams (History salvata)
    this.route.queryParams.subscribe(params => {
      this.historyId = +params['historyId'];

      if (this.historyId) {
        // Caso: Caricamento da storico
        this.historyService.getHistoryById(this.historyId).subscribe({
          next: history => {
            this.history = history;
            this.resultAnalysis = history.analysisData as ResultAnalysis_3;
            this.setupCommunities();
            this.buildAllCharts();
          },
          error: err => {
            console.error('Errore caricamento history:', err);
            // Opzionale: redirect anche qui se la history fallisce
            this.router.navigate(['/analysis']);
          }
        });
      } else {
        // 3. Caso: Reload della pagina o accesso diretto senza dati
        this.analysis3Request = this.analysisService.getAnalysisResult();

        // *** LOGICA DI PROTEZIONE ***
        // Se il service è vuoto o non ci sono membri, reindirizza
        if (!this.analysis3Request || !this.analysis3Request.members || this.analysis3Request.members.length === 0) {
          console.warn('Dati persi dopo il reload. Reindirizzamento a /analysis');
          this.router.navigate(['/analysis']);
          return;
        }

        // Se siamo qui, abbiamo i dati dal service (es. singleton non pulito), procediamo
        this.wantToRemove = this.analysis3Request?.wantToRemove;
        this.wantToAdd = this.analysis3Request?.wantToAdd;
        this.members = this.analysis3Request?.members;

        if (this.members && this.wantToRemove) {
          this.removedMembers = this.wantToRemove
            .map(id => this.members!.find(m => m.id === id))
            .filter((m): m is MemberDetail => m !== undefined);
        }

        if (this.members && this.members.length > 0 && this.wantToAdd && this.wantToRemove) {
          this.analysisService.getResultAnalysis_3(this.members, this.wantToAdd, this.wantToRemove).subscribe({
            next: (data) => {
              this.resultAnalysis = data;
              this.setupCommunities();
              this.buildAllCharts();
            },
            error: (err) => {
              console.error(err);
              this.router.navigate(['/analysis']); // Redirect anche in caso di errore API
            }
          });
        } else {
          // Fallback di sicurezza ulteriore
          this.router.navigate(['/analysis']);
        }
      }
    });
  }

  setupCommunities() {
    if (!this.resultAnalysis) return;

    this.communities = [
      {
        community: this.resultAnalysis.defaultCommunity,
        title: 'Default Community',
        icon: 'fa-users',
        iconColor: 'darkgreen',
        showRemoved: false,
        showLegend: false
      },
      {
        community: this.resultAnalysis.optimalCommunity,
        title: 'Optimal Community',
        icon: 'fa-gem',
        iconColor: 'darkgreen',
        showRemoved: false,
        showLegend: true
      },
      {
        community: this.resultAnalysis.wantedCommunity,
        title: 'Wanted Community',
        icon: 'fa-heart',
        iconColor: 'darkgreen',
        showRemoved: true,
        showLegend: true
      }
    ];
  }

  toggleCommunity(community: SingleAnalysis, el: HTMLElement) {
    const expanded = this.isCommunityExpanded(community);
    this.communityExpanded = expanded ? null : community;

    if (!expanded) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }

  isCommunityExpanded(community: SingleAnalysis): boolean {
    return this.communityExpanded == community;
  }

  isInRemovalList(memberId: any): boolean {
    return this.wantToRemove?.some(id => id === memberId) ?? false;
  }

  isInAdditionList(memberId: any): boolean {
    return this.wantToAdd?.some(id => id === memberId) ?? false;
  }

  buildAllCharts() {
    this.buildOptConsProdProfCharts();
    this.buildTotalComparisonChart();
    this.buildKpiChart();
    this.buildGlobalKpiChart();
    this.buildGlobalProdConsChart();
  }

  // --- GRAFICO 1: Production vs Consumption (Globale) ---
  buildGlobalProdConsChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.globalProdConsChartData = {
      labels,
      datasets: [
        // --- DEFAULT (Grigio) ---
        {
          label: 'Default - Production',
          data: this.resultAnalysis.defaultCommunity.totalProduction,
          borderColor: '#757575',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: 'Default - Consumption',
          data: this.resultAnalysis.defaultCommunity.totalConsumption,
          borderColor: '#757575',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.25
        },

        // --- WANTED (Blu) ---
        {
          label: 'Wanted - Production',
          data: this.resultAnalysis.wantedCommunity.totalProduction,
          borderColor: '#1976D2',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: 'Wanted - Consumption',
          data: this.resultAnalysis.wantedCommunity.totalConsumption,
          borderColor: '#1976D2',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.25
        },

        // --- OPTIMAL (Verde) ---
        {
          label: 'Optimal - Production',
          data: this.resultAnalysis.optimalCommunity.totalProduction,
          borderColor: '#388E3C',
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.25
        },
        {
          label: 'Optimal - Consumption',
          data: this.resultAnalysis.optimalCommunity.totalConsumption,
          borderColor: '#388E3C',
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderDash: [5, 5],
          tension: 0.25
        }
      ]
    };
  }

  // --- GRAFICO 2: KPIs (Globale) ---
  buildGlobalKpiChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.globalKpiChartData = {
      labels,
      datasets: [
        // --- DEFAULT (Grigio) ---
        {
          label: 'Default - Shared Energy',
          data: this.resultAnalysis.defaultCommunity.kpi1,
          borderColor: '#757575',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: 'Default - Self-Sufficiency',
          data: this.resultAnalysis.defaultCommunity.kpi2,
          borderColor: '#757575',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.25
        },

        // --- WANTED (Blu) ---
        {
          label: 'Wanted - Shared Energy',
          data: this.resultAnalysis.wantedCommunity.kpi1,
          borderColor: '#1976D2',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.25
        },
        {
          label: 'Wanted - Self-Sufficiency',
          data: this.resultAnalysis.wantedCommunity.kpi2,
          borderColor: '#1976D2',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.25
        },

        // --- OPTIMAL (Verde) ---
        {
          label: 'Optimal - Shared Energy',
          data: this.resultAnalysis.optimalCommunity.kpi1,
          borderColor: '#388E3C',
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.25
        },
        {
          label: 'Optimal - Self-Sufficiency',
          data: this.resultAnalysis.optimalCommunity.kpi2,
          borderColor: '#388E3C',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          borderWidth: 3,
          tension: 0.25
        }
      ]
    };
  }

  buildOptConsProdProfCharts() {
    if (!this.resultAnalysis) return;
    this.buildChartsForCommunity(this.resultAnalysis.defaultCommunity);
    this.buildChartsForCommunity(this.resultAnalysis.optimalCommunity);
    this.buildChartsForCommunity(this.resultAnalysis.wantedCommunity);
  }

  private generateDynamicColors(count: number, type: 'producer' | 'consumer'): string[] {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saturation = 70;
    const lightness = isDarkMode ? 70 : 40;

    const producerHueRange = { start: 0, end: 60 };

    const consumerHueRange = { start: 180, end: 240 };

    const hueConfig = type === 'producer' ? producerHueRange : consumerHueRange;

    const colors: string[] = [];
    if (count === 0) {
      return colors;
    }

    const hueStep = count > 1 ? (hueConfig.end - hueConfig.start) / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const hue = hueConfig.start + (count > 1 ? i * hueStep : (hueConfig.end - hueConfig.start) / 2);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }


  buildChartsForCommunity(community: SingleAnalysis) {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    const consumers = community.assignments.filter(m => m.profiles.some(p => p.profileType === 'CONSUMER'));
    const producers = community.assignments.filter(m => m.profiles.some(p => p.profileType === 'PRODUCER'));

    const consumerColors = this.generateDynamicColors(consumers.length, 'consumer');
    const producerColors = this.generateDynamicColors(producers.length, 'producer');

    const datasetsConsumers = consumers.map((member, index) => {
      const consumerProfile = member.profiles.find(p => p.profileType === 'CONSUMER');
      return {
        label: member.fullName,
        data: consumerProfile!.graph, 
        borderColor: consumerColors[index],
        backgroundColor: 'transparent',
        tension: 0.25,
      };
    });

    const datasetsProducers = producers.map((member, index) => {
      const producerProfile = member.profiles.find(p => p.profileType === 'PRODUCER');
      return {
        label: member.fullName,
        data: producerProfile!.graph, 
        borderColor: producerColors[index],
        backgroundColor: 'transparent',
        tension: 0.25,
      };
    });

    this.optConsProfChart.set(community, { labels, datasets: datasetsConsumers });
    this.optProdProfChart.set(community, { labels, datasets: datasetsProducers });
  }

  buildTotalComparisonChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    const buildChart = (community: SingleAnalysis) => {
      this.totalComparisonChart.set(community, {
        labels,
        datasets: [
          {
            label: 'Total Production',
            data: community.totalProduction,
            borderColor: 'red',
            backgroundColor: 'transparent',
            tension: 0.25,
          },
          {
            label: 'Total Consumption',
            data: community.totalConsumption,
            borderColor: 'green',
            backgroundColor: 'transparent',
            tension: 0.25,
          }
        ]
      });
    };

    buildChart(this.resultAnalysis.defaultCommunity);
    buildChart(this.resultAnalysis.optimalCommunity);
    buildChart(this.resultAnalysis.wantedCommunity);
  }

  buildKpiChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    const buildChart = (community: SingleAnalysis) => {
      this.kpiChart.set(community, {
        labels,
        datasets: [
          {
            label: 'Shared Energy',
            data: community.kpi1,
            borderColor: 'blue',
            backgroundColor: 'transparent',
            tension: 0.25,
          },
          {
            label: 'Self-Sufficiency',
            data: community.kpi2,
            borderColor: 'orange',
            backgroundColor: 'transparent',
            tension: 0.25,
          }
        ]
      });
    };

    buildChart(this.resultAnalysis.defaultCommunity);
    buildChart(this.resultAnalysis.optimalCommunity);
    buildChart(this.resultAnalysis.wantedCommunity);
  }

  getAvatarClass(memberId: any, showLegend: boolean): string {
    if (!showLegend) return 'avatar';
    if (this.isInRemovalList(memberId)) return 'to-remove';
    if (this.isInAdditionList(memberId)) return 'to-add';
    return 'avatar';
  }

  resetAnalysisData() {
    this.resultAnalysis = null;
    this.history = undefined;
    this.members = undefined;
    this.wantToRemove = undefined;
    this.wantToAdd = undefined;
    this.removedMembers = [];
    this.addedMembers = [];
    this.analysis3Request = undefined;
    this.communities = [];
    this.communityExpanded = null;
    this.optConsProfChart.clear();
    this.optProdProfChart.clear();
    this.totalComparisonChart.clear();
    this.kpiChart.clear();
    this.globalKpiChartData = undefined;
    this.globalProdConsChartData = undefined;
  }

}
