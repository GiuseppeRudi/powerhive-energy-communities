import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanService } from '../services/plan.service';
import { Plan, Member, User, } from '../models/models';
import {mockUser} from '../models/mock'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  plan?: Plan;


  ngOnInit() {
    this.plan = mockUser.plan;
    console.log(this.plan);
    /*
    this.planService.getCurrentUser().subscribe((user: User) => {
      this.plan = mockUser.plan;
    });
     */
  }
}
