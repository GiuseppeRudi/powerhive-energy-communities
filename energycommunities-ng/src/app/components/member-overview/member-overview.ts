import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { MemberDetail} from '../../model/member/MemberDetail';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule, Location } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { AuthService } from '../../services/auth/auth.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent],
  templateUrl: './member-overview.html',
  styleUrls: ['../welcome/welcome.css', './member-overview.css']
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
              private authService: AuthService,
              private location: Location) { }


  ngOnInit() {
    window.scrollTo(0, 0);
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

  private generateDynamicColors(count: number, type: 'producer' | 'consumer'): string[] {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saturation = 70;
    const lightness = isDarkMode ? 70 : 40;

    const producerHueRange = { start: 0, end: 60 };

    const consumerHueRange = { start: 180, end: 240 };

    const hueConfig = type === 'producer' ? producerHueRange : consumerHueRange;

    const colors: string[] = [];
    if (count === 0) {
      return colors;
    }

    const hueStep = count > 1 ? (hueConfig.end - hueConfig.start) / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const hue = hueConfig.start + (count > 1 ? i * hueStep : (hueConfig.end - hueConfig.start) / 2);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }

  buildCharts(member: MemberDetail) {
    const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
    const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');

    const producerColors = this.generateDynamicColors(producers.length, 'producer');
    const consumerColors = this.generateDynamicColors(consumers.length, 'consumer');

    if (producers.length > 0) {
      this.produceChartData = {
        labels: Array.from({ length: producers[0].graph.length }, (_, i) => i.toString()),
        datasets: producers.map((p, index) => ({
          label: `Producer Profile ${p.id}`,
          data: p.graph,
          borderColor: producerColors[index],
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
          borderColor: consumerColors[index],
          backgroundColor: 'transparent',
          tension: 0.25
        }))
      };
    }
  }

  goBack(): void {
    this.location.back();
  }
}
