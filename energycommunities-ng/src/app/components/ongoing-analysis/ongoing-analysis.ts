import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {OngoingAnalysis} from '../../model/analysis/OngoingAnalysis';
import {OngoingAnalysisService} from '../../services/ongoing-analysis.service';
import {GenerationLoader} from '../generation-loader/generation-loader';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {User} from '../../model/User';
import {ClingoEventsService} from '../../services/clingo-events.service';

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
  styleUrls: ['./ongoing-analysis.css', '../welcome/welcome.css']
})
export class OngoingAnalysisComponent implements OnInit {

  analyses: OngoingAnalysis[] = [];
  loading = true;

  statusMessage: Map<number,string> = new Map<number, string>();

  constructor(
    private service: OngoingAnalysisService,
    private router: Router,
    private clingoEvents: ClingoEventsService
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

    this.analyses.forEach((analysis, index) => {
      console.log(analysis)
      if(analysis.status === 'FINISHED' || analysis.status === 'ERROR') {
        this.statusMessage.set(analysis.id, analysis.status);
      } else {
        this.statusMessage.set(analysis.id, 'STARTING');
      }
    });
    this.clingoEvents.connect((eventName,analysisId) => {
      console.log(eventName + ' ' + analysisId);
      console.log(this.statusMessage);
      if (analysisId !== -1) {
        if (eventName === 'GROUNDING_STARTED') {
          this.statusMessage.set(analysisId, 'GROUNDING');
        }
        if (eventName === 'GROUNDING_FINISHED') {
          this.statusMessage.set(analysisId, 'SOLVING');
        }
        if (eventName === 'FINISHED') {
          this.statusMessage.set(analysisId, 'FINISHED');
        }
      }
    });
  }

  open(item: OngoingAnalysis) {
    if ((item.status !== 'FINISHED' && item.status !== 'ERROR') &&
      (this.statusMessage.get(item.id) !== 'FINISHED' && this.statusMessage.get(item.id) !== 'ERROR')) return;

    this.service.openAnalysis(item.id).subscribe((data: any) => {
      console.log(data);
      if (data !== null) {
        this.router.navigate(['/analysis1'], {
          state: {result: data}
        });
      } else {
        window.location.reload();
        // alert('The analysis ended with an error.');
      }
    });
  }

  getStatusById(id: number): string | null {
    const analysis = this.analyses.find(a => a.id === id);
    return analysis ? analysis.status : null;
  }

  getStatusClass(id: number): string {
    console.log()
    switch(this.statusMessage.get(id) || this.getStatusById(id)) {
      case 'STARTING': return 'status starting';
      case 'GROUNDING': return 'status grounding';
      case 'SOLVING': return 'status solving';
      case 'RUNNING': return 'status running';
      case 'FINISHED': return 'status finished';
      case 'ERROR': return 'status error';
      default: return 'status';
    }
  }
}
