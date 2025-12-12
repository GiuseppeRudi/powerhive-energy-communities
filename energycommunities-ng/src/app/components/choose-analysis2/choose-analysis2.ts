import { Component } from '@angular/core';
import {EnergyChartComponent} from "../energy-chart/energy-chart";
import {GenerationLoader} from "../generation-loader/generation-loader";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {MemberDetail} from '../../model/member/MemberDetail';
import {ChartData, ChartOptions} from 'chart.js';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PlanService} from '../../services/plan.service';
import {AuthService} from '../../services/auth/auth.service';
import {AnalysisService} from '../../services/analysis.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-choose-analysis2',
  templateUrl: './choose-analysis2.html',
  styleUrls: ['./choose-analysis2.css', '../welcome/welcome.css'],
  standalone: true,
  imports: [
    CommonModule,
    EnergyChartComponent,
    GenerationLoader,
    FormsModule,
    RouterLink
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
      this.isLoading = true;
      this.planService.getDetailPlan(user.plan_id).subscribe({
        next: (plan) => {
          this.members = plan.members;
          this.buildMemberCharts();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
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

  /** Seleziona tutti i membri */
  selectAll() {
    this.energyCommunities = this.members.map(m => m.id);
    this.communitySize = this.energyCommunities.length;
  }

  /** Deseleziona tutti i membri */
  deselectAll() {
    this.energyCommunities = [];
    this.communitySize = 0;
  }

  /** Toggle all checkbox handler */
  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

  /** Verifica se tutti i membri sono selezionati */
  isAllSelected(): boolean {
    return this.members.length > 0 && this.energyCommunities.length === this.members.length;
  }

  /** Verifica se è in stato indeterminato (alcuni selezionati) */
  isIndeterminate(): boolean {
    return this.energyCommunities.length > 0 && this.energyCommunities.length < this.members.length;
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


  startAnalysis2() {
    if (this.communitySize <= 0) {
      alert('Inserisci una dimensione valida per la community prima di continuare.');
      return;
    }

    if (this.energyCommunities.length === 0) {
      alert('Seleziona almeno un membro prima di continuare.');
      return;
    }

    const selectedMembers = this.members.filter(m => this.energyCommunities.includes(m.id));

    const body : any ={
      members : selectedMembers,
      dimCommunity : this.communitySize,
    }

    this.analysisService.setAnalysisResult(body);

    this.router.navigate(['/analysis2']);

  }

  runAnalysisAsync() {
    const memberIds: number[] = this.energyCommunities;
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);

    const payload = {
      memberIds: memberIds,
      userId: user.id,
      analysis: 2,
      dim: this.communitySize
    }

    console.log(payload);

    this.analysisService.runAsync(payload).subscribe(id => {
      this.router.navigate(['/ongoing-analysis']);
    });
  }
}
