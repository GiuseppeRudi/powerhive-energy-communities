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
import {Analysis3Request} from '../../model/analysis/Analysis3Request';
import {AnalysisActionsComponent} from '../analysis-save/analysis-save';
import {CommunityData} from '../../model/CommunityData';

@Component({
  selector: 'app-analisys3',
  templateUrl: './analysis3.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule, AnalysisActionsComponent],
  styleUrls: ['./analysis3.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis3 implements OnInit {

  history : HistorySummary | undefined = undefined ;
  resultAnalysis: ResultAnalysis_3 | null = null;
  communityExpanded: SingleAnalysis | null = null;

  communities: CommunityData[] = [];

  optConsProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  optProdProfChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  totalComparisonChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();
  kpiChart: Map<SingleAnalysis, ChartData<'line'>> = new Map();

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
        max: 100,
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
    private route : ActivatedRoute,
    private analysisService: AnalysisService,
    private authService: AuthService,
    private historyService: HistoryService
  ) {}

  typeAnalysis : number = 3;
  historyId: number | null  = null;
  members: MemberDetail[] | undefined;
  wantToRemove: number[] | undefined;
  removedMembers: MemberDetail[] = [];
  wantToAdd: number[] | undefined;
  addedMembers: MemberDetail[] = [];
  analysis3Request: Analysis3Request | undefined = undefined ;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.historyId = +params['historyId'];

      if (this.historyId) {
        // Caricamento da history (come prima)
        this.historyService.getHistoryById(this.historyId).subscribe({
          next: history => {
            this.history = history;
            this.resultAnalysis = history.analysisData as ResultAnalysis_3;
            this.setupCommunities();
            this.buildAllCharts();
          },
          error: err => console.error('Errore caricamento history:', err)
        });
      } else {

        this.analysis3Request = this.analysisService.getAnalysisResult()

        this.wantToRemove = this.analysis3Request?.wantToRemove;
        this.wantToAdd = this.analysis3Request?.wantToAdd;
        this.members = this.analysis3Request?.members;


        if (this.members && this.wantToRemove) {
          this.removedMembers = this.wantToRemove
            .map(id => this.members!.find(m => m.id === id))
            .filter((m): m is MemberDetail => m !== undefined);
        }



        if(this.members && this.members.length > 0 && this.wantToAdd  && this.wantToRemove) {
          this.analysisService.getResultAnalysis_3(this.members,this.wantToAdd,this.wantToRemove).subscribe({
            next: (data) => {
              this.resultAnalysis = data;
              this.setupCommunities();
              this.buildAllCharts();
            },
            error: (err) => console.error(err)
          });
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
  }

  buildOptConsProdProfCharts() {
    if (!this.resultAnalysis) return;


    this.buildChartsForCommunity(this.resultAnalysis.defaultCommunity);
    this.buildChartsForCommunity(this.resultAnalysis.optimalCommunity);
    this.buildChartsForCommunity(this.resultAnalysis.wantedCommunity);
  }

  buildChartsForCommunity(community: SingleAnalysis) {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];
    let datasetsConsumers: any[] = [];
    let datasetsProducers: any[] = [];

    community.assignments.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName,
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25,
        });
      }

      if (producer) {
        datasetsProducers.push({
          label: member.fullName,
          data: producer.graph,
          borderColor: colors[(index + 4) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25,
        });
      }
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
    // Pulisce tutti i dati dell’analisi
    this.resultAnalysis = null;
    this.history = undefined;
    this.members = undefined;
    this.wantToRemove = undefined;
    this.wantToAdd = undefined;
    this.removedMembers = [];
    this.addedMembers = [];
    this.analysis3Request = undefined;

    // Pulisce le comunità e grafici
    this.communities = [];
    this.communityExpanded = null;

    this.optConsProfChart.clear();
    this.optProdProfChart.clear();
    this.totalComparisonChart.clear();
    this.kpiChart.clear();

  }

}

