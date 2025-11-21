import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../services/plan.service';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../model/User';
import {PlanSummary} from '../../model/plan/PlanSummary';


@Component({
  selector: 'app-member-chooser',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './member-chooser.html',
  styleUrls: ['./member-chooser.css', '../welcome/welcome.css']
})
export class MemberChooser implements OnInit {
  plan?: PlanSummary;
  currentUser: User | null = null;
  selectedMembers: Set<number> = new Set();
  showError: boolean = false;

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private analysisService: AnalysisService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => this.currentUser = user);

    if (this.currentUser?.plan_id != null) {
      this.planService.getSummaryPlan(this.currentUser.plan_id).subscribe({
        next: (plan: PlanSummary) => {
          this.plan = plan;
          console.log('Plan loaded:', this.plan);
        },
        error: (error: Error) => {
          console.error('Error loading plan:', error);
        }
      });
    }
  }

  toggleMemberSelection(memberId: number) {
    if (this.selectedMembers.has(memberId)) {
      this.selectedMembers.delete(memberId);
    } else {
      this.selectedMembers.add(memberId);
    }
    this.showError = false;
  }

  selectAll() {
    if (this.plan && this.plan.members) {
      this.plan.members.forEach(member => {
        this.selectedMembers.add(member.id);
      });
    }
    this.showError = false;
  }

  deselectAll() {
    this.selectedMembers.clear();
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
    if (!this.plan || !this.plan.members || this.plan.members.length === 0) {
      return false;
    }
    return this.selectedMembers.size === this.plan.members.length;
  }

  isIndeterminate(): boolean {
    if (!this.plan || !this.plan.members) {
      return false;
    }
    const selectedCount = this.selectedMembers.size;
    return selectedCount > 0 && selectedCount < this.plan.members.length;
  }

  getSelectedCount(): number {
    return this.selectedMembers.size;
  }

  /*getProfileCount(member: MemberSummary): number {
    return member.profiles ? member.profiles.length : 0;
  }*/

  runAnalysis() {
    // Validazione: almeno un membro selezionato
    if (this.selectedMembers.size === 0) {
      this.showError = true;
      return;
    }

    console.log('Running analysis with selected members:', Array.from(this.selectedMembers));

    // Naviga verso analysis1 e passa gli ID dei membri selezionati
    this.router.navigate(['/analysis1'], {
      queryParams: {
        memberIds: Array.from(this.selectedMembers).join(',')
      }
    });
  }

  runAnalysisAsync() {
    const memberIds: number[] = Array.from(this.selectedMembers);
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);
    this.analysisService.runAsync1(user.id, 1, memberIds).subscribe(id => {
      this.router.navigate(['/ongoing-analysis']);
    });
  }
}
