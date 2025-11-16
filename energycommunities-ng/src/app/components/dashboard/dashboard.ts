import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PlanService} from '../../services/plan.service';
import { User } from '../../model/User';
import { PlanSummary} from '../../model/plan/PlanSummary';
import { AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: '../welcome/welcome.css'
})
export class Dashboard implements OnInit {
  plan?: PlanSummary;
  currentUser : User | null = null;


  constructor(private authService: AuthService,
              private planService : PlanService) { }

  ngOnInit() {

    this.authService.user$.subscribe(user => this.currentUser = user);


    console.log(this.currentUser);
    if(this.currentUser?.plan_id != null) {
      this.planService.getSummaryPlan(this.currentUser.plan_id).subscribe({
          next: (plan: PlanSummary) => {
            this.plan = plan;
            console.log(this.plan);

          },
          error: (error: Error) => {
            console.log(error);
          },
        }
      );
    }

  }
}
