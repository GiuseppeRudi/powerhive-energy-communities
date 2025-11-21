import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {OngoingAnalysis} from '../../model/analysis/OngoingAnalysis';
import {OngoingAnalysisService} from '../../services/ongoing-analysis.service';
import {GenerationLoader} from '../generation-loader/generation-loader';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {User} from '../../model/User';

@Component({
  selector: 'app-ongoing-analysis',
  templateUrl: './ongoing-analysis.html',
  imports: [
    GenerationLoader,
    NgClass,
    NgForOf,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./ongoing-analysis.css']
})
export class OngoingAnalysisComponent implements OnInit {

  analyses: OngoingAnalysis[] = [];
  loading = true;

  constructor(
    private service: OngoingAnalysisService,
    private router: Router
  ) {}

  ngOnInit() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;

    const user: User = JSON.parse(userJson);
    this.service.getAll(user.id).subscribe({
      next: (data) => {
        this.analyses = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  open(item: OngoingAnalysis) {
    if (item.status === 'PENDING' || item.status === 'RUNNING') return;

    this.service.openAnalysis(item.id).subscribe((data: any) => {
      if (data==null) window.location.reload();
      else if (data.status === 'FINISHED') {
        this.router.navigate(['/analysis-result'], {
          state: { result: data.resultModel }
        });
      } else {
        alert('The analysis ended with an error.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'status pending';
      case 'RUNNING': return 'status running';
      case 'FINISHED': return 'status finished';
      case 'ERROR': return 'status error';
      default: return 'status';
    }
  }
}
