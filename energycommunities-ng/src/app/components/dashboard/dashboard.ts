import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PlanService} from '../../services/plan.service';
import { User } from '../../model/User';
import { Plan} from '../../model/Plan';
import { AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: '../welcome/welcome.css'
})
export class Dashboard implements OnInit {
  plan?: Plan;
  currentUser : User | null = null;


  constructor(private authService: AuthService,
              private planService : PlanService) { }

  ngOnInit() {

    this.authService.user$.subscribe(user => this.currentUser = user);

    if(this.currentUser?.plan_id != null) {
      this.planService.getPlan(this.currentUser.plan_id).subscribe({
          next: (plan: Plan) => {
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
