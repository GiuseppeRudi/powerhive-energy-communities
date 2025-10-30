import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Member, Profile, ProfileGraph, MemberType } from '../../model/models';
import {member1} from '../../model/mock';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent],
  templateUrl: './member-overview.html',
  styleUrl: '../welcome/welcome.css'
})
export class MemberOverview implements OnInit {
  member?: Member;
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

  constructor(private route: ActivatedRoute/*, private planService: PlanService*/) {}



  ngOnInit() {
    const memberId = Number(this.route.snapshot.paramMap.get('id'));
    /*
    this.planService.getCurrentUser().subscribe(user => {
      this.member = user.plan.members.find(m => m.id === memberId);
      if (this.member) {
        this.buildCharts(this.member);
      }
    });
     */
    this.buildCharts(member1);
    this.member = member1;
  }

  buildCharts(member: Member) {
    const producers = member.profiles.filter(p => p.type === 'PRODUCER');
    const consumers = member.profiles.filter(p => p.type === 'CONSUMER');
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    if (producers.length > 0) {
      this.produceChartData = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString()),
        datasets: producers.map((p,index) => ({
          label: `Producer Profile ${p.id}`,
          data: p.profileGraph.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }))
      };
    }

    if (consumers.length > 0) {
      this.consumeChartData = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString()),
        datasets: consumers.map((p,index) => ({
          label: `Consumer Profile ${p.id}`,
          data: p.profileGraph.graph,
          borderColor: colors[(index + producers.length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        }))
      };
    }
  }
}
