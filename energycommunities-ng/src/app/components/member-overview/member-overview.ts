import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { MemberDetail} from '../../model/MemberDetail';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { AuthService } from '../../services/auth.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent],
  templateUrl: './member-overview.html',
  styleUrl: '../welcome/welcome.css'
})
export class MemberOverview  {
  currentUser : User | null = null;
  member?: MemberDetail;
  memberId : number | null = null;

  consumeChartData?: ChartData<any>;
  produceChartData?: ChartData<any>;

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: { legend: { display: true } }
  };

  constructor(private route: ActivatedRoute,
              private planService: PlanService,
              private authService: AuthService) { }


  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;

      this.route.paramMap.subscribe(paramMap => {
        const id = paramMap.get('id');
        if (id && this.currentUser) {
          this.memberId = +id;
          this.planService.getMember(this.currentUser.plan_id, this.memberId).subscribe({
            next: (member: MemberDetail) => {
              console.log(member);
              this.member = member;
              this.buildCharts(member);
            },
            error: (error: Error) => console.error(error)
          });
        }
      });
    });
  }

  buildCharts(member: MemberDetail) {
    const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
    const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    if (producers.length > 0) {
      this.produceChartData = {
        labels: Array.from({ length: producers[0].graph.length }, (_, i) => i.toString()),
        datasets: producers.map((p, index) => ({
          label: `Producer Profile ${p.id}`,
          data: p.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }))
      };
    }

    if (consumers.length > 0) {
      this.consumeChartData = {
        labels: Array.from({ length: consumers[0].graph.length }, (_, i) => i.toString()),
        datasets: consumers.map((p, index) => ({
          label: `Consumer Profile ${p.id}`,
          data: p.graph,
          borderColor: colors[(index + producers.length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }))
      };
    }
  }

}
