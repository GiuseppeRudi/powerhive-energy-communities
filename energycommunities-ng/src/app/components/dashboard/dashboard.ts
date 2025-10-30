import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PlanService} from '../../services/plan.service';
import { User } from '../../model/User';
import {  Member } from '../../model/models';
import { Plan} from '../../model/Plan';
import {mockUser} from '../../model/mock'
import { AuthService} from '../../services/auth.service';
import {mockPlan} from '../../model/mock';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: '../welcome/welcome.css'
})
export class Dashboard implements OnInit {
  plan?: Plan;

  constructor(private authService: AuthService) { }

  currentUser : User | null = null;


  ngOnInit() {

    this.authService.user$.subscribe(user => this.currentUser = user);

    this.plan = mockPlan;
    console.log(this.plan);
    /*
    this.planService.getCurrentUser().subscribe((user: User) => {
      this.plan = mockUser.plan;
    });
     */
  }
}
