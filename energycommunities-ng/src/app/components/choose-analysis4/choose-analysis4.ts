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
import {User} from '../../model/User';
import {BatteryService} from '../../services/battery.service';
import {BatteryDto} from '../../model/battery/BatteryDto';
import {HistorySummary} from '../../model/history/HistorySummary';
import {HistoryService} from '../../services/history.service';
import {Analysis4Request} from '../../model/analysis/Analysis4Request';
import {AnalysisService} from '../../services/analysis.service';


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
  loading = true;
  error: string | null = null;
  userId: number = 0;
  showSavedAnalysis: boolean = false;
  historyList: HistorySummary[] = [];
  showMissingWarning: boolean = false;
  missingMembersList: string[] = [];

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
    private analysisService: AnalysisService,
    private historyService: HistoryService,
  ) {}

  ngOnInit() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);
    this.userId = user.id;

    this.loadHistory();

    if (user.plan_id) {
      this.isLoading = true;
      this.batteryService.get_batteries_by_plan(user.plan_id).subscribe(response => {
        this.plan_batteries = response;
      })

      this.planService.getDetailPlan(user.plan_id).subscribe({
        next: (plan) => {
          this.members = plan.members;
          console.log(this.members);
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
  loadHistory(): void {
    this.loading = true;
    this.error = null;

    this.historyService.getHistories(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        const filteredData = data.filter(h => h.analysisNumber === 2);
        this.historyList = filteredData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log(this.historyList);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Cronology loading error';
        this.loading = false;
        console.error(err);
      }
    });
  }
  addCommunityDefault(historyId: number) {

    this.showMissingWarning = false;
    this.missingMembersList = [];

    this.historyService.getHistoryMembers(historyId).subscribe({
      next: (assignmentsList: any[]) => {
        console.log('Member list received (Light Payload):', assignmentsList);

        if (assignmentsList && Array.isArray(assignmentsList)) {

          const currentPlanIds = this.members.map(m => m.id);
          const validIds: number[] = [];
          const missingNames: string[] = [];

          assignmentsList.forEach((item: any) => {
            let id: number;
            let name: string;

            if (typeof item === 'number') {
              id = item;
              name = `ID ${item}`;
            } else {
              id = Number(item.id || item.memberId);
              name = item.fullName || `ID ${id}`;
            }

            if (currentPlanIds.includes(id)) {
              validIds.push(id);
            } else {
              missingNames.push(name);
            }
          });
          this.energyCommunities = validIds;
          window.scrollTo({top: 350, behavior: 'smooth'});
          this.showSavedAnalysis = false;
          console.log(`Applied ${this.energyCommunities.length} valid members.`);

          if (missingNames.length > 0) {
            this.missingMembersList = missingNames;
            this.showMissingWarning = true;
          }

        } else {
          console.warn('Empty answer or invalid format.');
        }

      },
      error: (err) => {
        console.error('Error API GetMembers:', err);
        alert('Impossible to load the selected analysis.');
      }
    });
  }


  closeWarning() {
    this.showMissingWarning = false;
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

    const analysis4Request: Analysis4Request = {
      members : this.members.filter(m => this.energyCommunities.includes(m.id)),
      batteries: this.plan_batteries.filter(b => b.id !== null && this.batteriesList.includes(b.id)),
      budget : this.budget
    };

    this.analysisService.setAnalysisResult(analysis4Request)

    this.router.navigate(['/analysis4']);
  }

  hasSelectedProducer(): boolean {
    return this.members.some(
      m => this.energyCommunities.includes(m.id) && m.memberType === 'PRODUCER'
    );
  }


  runAnalysisAsync() {
    const memberIds = this.energyCommunities.map(id => id);
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);

    const payload = {
      memberIds: memberIds,
      userId: user.id,
      analysis: 4,
      batteries: this.batteriesList,
      budget: this.budget
    }

    console.log(payload);

    this.analysisService.runAsync(payload).subscribe(id => {
      this.router.navigate(['/ongoing-analysis']);
    });
  }
}
