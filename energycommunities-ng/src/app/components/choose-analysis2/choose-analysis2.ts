import { Component } from '@angular/core';
import {EnergyChartComponent} from "../energy-chart/energy-chart";
import {GenerationLoader} from "../generation-loader/generation-loader";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {MemberDetail} from '../../model/member/MemberDetail';
import {ChartData, ChartOptions} from 'chart.js';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanService} from '../../services/plan.service';
import {AuthService} from '../../services/auth/auth.service';
import {AnalysisService} from '../../services/analysis.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-choose-analysis2',
  templateUrl: './choose-analysis2.html',
  styleUrls: ['./choose-analysis2.css', '../analysis1/analysis1.css', '../welcome/welcome.css'],
  standalone: true,
  imports: [
    CommonModule,
    EnergyChartComponent,
    GenerationLoader,
    FormsModule
  ]
})
export class ChooseAnalysis2 {
  members: MemberDetail[] = [];
  chartDataMap: Map<number, ChartData<'line'>> = new Map();

  isLoading = false;
  memberExpandedState: Map<number, boolean> = new Map();

  energyCommunities: number[] = []; // membri selezionati
  communitySize: number = 0; // dimensione desiderata della community

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private analysisService: AnalysisService,
  ) {}

  ngOnInit() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);

    if (user.plan_id) {
      this.planService.getDetailPlan(user.plan_id).subscribe({
        next: (plan) => {
          this.members = plan.members;
          this.buildMemberCharts();
        },
        error: (error) => console.error(error)
      });
    }
  }

  toggleMember(memberId: number) {
    const current = this.memberExpandedState.get(memberId) || false;
    this.memberExpandedState.set(memberId, !current);
  }

  isMemberExpanded(memberId: number): boolean {
    return this.memberExpandedState.get(memberId) || false;
  }

  /** Seleziona o deseleziona un membro */
  toggleSelection(memberId: number) {
    if (this.energyCommunities.includes(memberId)) {
      this.energyCommunities = this.energyCommunities.filter(id => id !== memberId);
    } else {
      this.energyCommunities.push(memberId);
    }

    // Se il numero selezionato scende sotto communitySize, lo aggiorno
    if (this.communitySize > this.energyCommunities.length) {
      this.communitySize = this.energyCommunities.length;
    }
  }

  /** Aggiorna la dimensione della community (validata) */
  onCommunitySizeChange(event: any) {
    const value = Number(event.target.value);
    if (value > this.energyCommunities.length) {
      alert('La dimensione della community non può superare il numero di membri selezionati.');
      this.communitySize = this.energyCommunities.length;
    } else if (value < 0) {
      this.communitySize = 0;
    } else {
      this.communitySize = value;
    }
  }

  buildMemberCharts() {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.members.forEach((member) => {
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const datasets = [];

      if (producer) {
        datasets.push({
          label: 'Production',
          data: producer.graph,
          borderColor: '#FF6384',
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      if (consumer) {
        datasets.push({
          label: 'Consumption',
          data: consumer.graph,
          borderColor: '#36A2EB',
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }

      this.chartDataMap.set(member.id, { labels, datasets });
    });
  }

  getMemberTypeLabel(member: any): string {
    const hasProducer = member.profiles?.some((p: any) => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles?.some((p: any) => p.profileType === 'CONSUMER');
    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }


  startAnalysis3() {
    if (this.communitySize <= 0) {
      alert('Inserisci una dimensione valida per la community prima di continuare.');
      return;
    }

    const selectedMembers = this.members.filter(m => this.energyCommunities.includes(m.id));

    this.analysisService.getResultAnalysis_2(selectedMembers, this.communitySize)
      .subscribe({
        next: (result) => {
          console.log('Analisi completata:', result);
          this.analysisService.setAnalysisResult(result);
          this.router.navigate(['/analysis2']);
        },
        error: (err) => {
          console.error('Errore durante la richiesta:', err);
          alert('Si è verificato un errore durante l\'analisi. Riprova più tardi.');
        }
      });
  }

}


