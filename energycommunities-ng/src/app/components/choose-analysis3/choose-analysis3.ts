import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MemberDetail } from '../../model/member/MemberDetail';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/User';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { GenerationLoader } from '../generation-loader/generation-loader';
import { FormsModule } from '@angular/forms';
import {AnalysisService} from '../../services/analysis.service';

@Component({
  selector: 'app-choose-analysis3',
  templateUrl: './choose-analysis3.html',
  styleUrls: ['./choose-analysis3.css', '../analysis1/analysis1.css', '../welcome/welcome.css'],
  standalone: true,
  imports: [
    CommonModule,
    EnergyChartComponent,
    GenerationLoader,
    FormsModule
  ]
})
export class ChooseAnalysis3 implements OnInit {

  members: MemberDetail[] = [];

  // Mappa dei grafici
  chartDataMap: Map<number, ChartData<'line'>> = new Map();

  // Stato caricamento e espansione
  isLoading = false;
  memberExpandedState: Map<number, boolean> = new Map();

  // Gestione community
  communityMembers: number[] = [];  // membri già nella community
  wantToAdd: number[] = [];
  wantToRemove: number[] = [];

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

  /** Espande o collassa la sezione di un membro */
  toggleMember(memberId: number) {
    const current = this.memberExpandedState.get(memberId) || false;
    this.memberExpandedState.set(memberId, !current);
  }

  /** Verifica se un membro è espanso */
  isMemberExpanded(memberId: number): boolean {
    return this.memberExpandedState.get(memberId) || false;
  }

  /** Gestione selezione dei membri */
  onMemberStatusChange(member: MemberDetail, type: 'add' | 'remove' | 'default') {
    const memberId = member.id;

    if (type == 'default'){
      if(this.wantToAdd.includes(memberId)) return;

      // Se clicco "default", rimuovo da add
      this.wantToAdd = this.wantToAdd.filter(id => id !== memberId);


      // Toggle
      if (this.communityMembers.includes(memberId)) {
        this.communityMembers = this.communityMembers.filter(id => id !== memberId);
      } else {
        this.communityMembers.push(memberId);
      }
    }

    if (type === 'add') {
      // Non può essere nella community di default
      if (this.communityMembers.includes(memberId)) return;

      // Se clicco "add", rimuovo da remove
      this.wantToRemove = this.wantToRemove.filter(id => id !== memberId);

      // Toggle
      if (this.wantToAdd.includes(memberId)) {
        this.wantToAdd = this.wantToAdd.filter(id => id !== memberId);
      } else {
        this.wantToAdd.push(memberId);
      }
    }

    if (type === 'remove') {
      // Solo i membri della community possono essere rimossi
      if (!this.communityMembers.includes(memberId)) return;

      // Se clicco "remove", rimuovo da add
      this.wantToAdd = this.wantToAdd.filter(id => id !== memberId);

      // Toggle
      if (this.wantToRemove.includes(memberId)) {
        this.wantToRemove = this.wantToRemove.filter(id => id !== memberId);
      } else {
        this.wantToRemove.push(memberId);
      }
    }

    console.log('Add:', this.wantToAdd, 'Remove:', this.wantToRemove);
  }

  /** Costruisce i grafici per ogni membro */
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

  /** Tipo di membro */
  getMemberTypeLabel(member: any): string {
    const hasProducer = member.profiles?.some((p: any) => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles?.some((p: any) => p.profileType === 'CONSUMER');
    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }

  startAnalysis3(){

    const chooseMembers : MemberDetail[] = [];
    for (const member of this.members) {
      if(this.communityMembers.includes(member.id)) {
        members.push(member);
      }

      if(this.wantToRemove.includes(member.id)) {
        members.push(member);
      }
      if(this.wantToAdd.includes(member.id)) {
        members.push(member);
      }
    }

    this.analysisService.getResultAnalysis_3(chooseMembers,this.wantToRemove, this.wantToAdd);

    this.wantToAdd = []
    this.wantToRemove = []
    this.communityMembers = []

    this.router.navigate(['/analysis3']);
  }
}
