import { Component } from '@angular/core';
import {EnergyChartComponent} from "../energy-chart/energy-chart";
import {GenerationLoader} from "../generation-loader/generation-loader";
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {MemberDetail} from '../../model/member/MemberDetail';
import {ChartData, ChartOptions} from 'chart.js';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PlanService} from '../../services/plan.service';
import {AuthService} from '../../services/auth/auth.service';
import {AnalysisService} from '../../services/analysis.service';
import {User} from '../../model/User';
import {BatteryService} from '../../services/battery.service';
import {BatteryDto} from '../../model/battery/BatteryDto';


@Component({
  selector: 'app-choose-analysis4',
  templateUrl: './choose-analysis4.html',
  styleUrls: ['./choose-analysis4.css', '../welcome/welcome.css'],
  standalone: true,
  imports: [
    CommonModule,
    EnergyChartComponent,
    GenerationLoader,
    FormsModule,
    RouterLink
  ]
})
export class ChooseAnalysis4 {
  members: MemberDetail[] = [];
  plan_batteries: BatteryDto[] = []
  chartDataMap: Map<number, ChartData<'line'>> = new Map();

  isLoading = false;
  memberExpandedState: Map<number, boolean> = new Map();

  energyCommunities: number[] = [];
  batteriesList: number[] = [];
  budget: number = 0;


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
    private batteryService: BatteryService,
    private router: Router,
    private planService: PlanService,
  ) {}

  ngOnInit() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);

    if (user.plan_id) {
      this.isLoading = true;
      this.batteryService.get_batteries_by_plan(user.plan_id).subscribe(response => {
        this.plan_batteries = response;
      })

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

  toggleSelection(memberId: number) {
    if (this.energyCommunities.includes(memberId)) {
      this.energyCommunities = this.energyCommunities.filter(id => id !== memberId);
    } else {
      this.energyCommunities.push(memberId);
    }

  }

  selectAll() {
    this.energyCommunities = this.members.map(m => m.id);
  }

  deselectAll() {
    this.energyCommunities = [];
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

  isAllSelected(): boolean {
    return this.members.length > 0 && this.energyCommunities.length === this.members.length;
  }

  isIndeterminate(): boolean {
    return this.energyCommunities.length > 0 && this.energyCommunities.length < this.members.length;
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


  toggleSelectionBatteries(batteryId: number | null) {
    if (batteryId === null || batteryId === undefined) return;

    if (this.batteriesList.includes(batteryId)) {
      this.batteriesList = this.batteriesList.filter(id => id !== batteryId);
    } else {
      this.batteriesList.push(batteryId);
    }
  }

  isBatterySelected(batteryId: number | null): boolean {
    if (batteryId === null || batteryId === undefined) return false;
    return this.batteriesList.includes(batteryId);
  }

  selectAllBatteries() {
    this.batteriesList = this.plan_batteries
      .map(b => b.id)
      .filter((id): id is number => id !== null && id !== undefined);
  }

  deselectAllBatteries() {
    this.batteriesList = [];
  }

  startAnalysis4() {

    if (this.energyCommunities.length === 0) {
      alert('Select at least one member to continue.');
      return;
    }

    const selectedMembers = this.members.filter(m => this.energyCommunities.includes(m.id));
    const selectedBatteries = this.plan_batteries.filter(b => b.id !== null && this.batteriesList.includes(b.id));
    const budget = this.budget;

    const queryParams = {
      members: JSON.stringify(selectedMembers),
      batteries: JSON.stringify(selectedBatteries),
      budget: budget
    };

    this.router.navigate(['/analysis4'], { queryParams });
  }
}
