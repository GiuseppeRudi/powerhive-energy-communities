import {Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../model/User';
import {SaveAnalysisRequest} from '../../model/SaveAnalysisRequest';
import {HistoryService} from '../../services/history.service';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HistorySummary} from '../../model/history/HistorySummary';

@Component({
  selector: 'app-analysis-actions',
  templateUrl: './analysis-save.html',
  styleUrls: ['./analysis-save.css'],
  imports: [FormsModule,
  CommonModule]
})
export class AnalysisActionsComponent implements OnInit {

  @Input() resultAnalysis: any | null = null;
  @Input() typeAnalysis: number = 0;
  @Input() history: HistorySummary | undefined = undefined ;

  @Output() terminated = new EventEmitter<void>();

  analysisName = '';

  constructor(
    private router : Router,
    private historyService : HistoryService
  ) {}

  ngOnInit() {
    console.log(this.history);
  }

  onSave() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) {
      console.log('Nessun utente loggato');
      return;
    }

    const user: User = JSON.parse(userJson);

    if (!this.analysisName.trim()) {
      alert('Please enter a name for the analysis before saving.');
      return;
    }

    const saveAnalysisRequest: SaveAnalysisRequest = {
      userId: user.id,
      analysisName: this.analysisName.trim(),
      analysisNumber: this.typeAnalysis,
      analysisData: this.resultAnalysis
    };

    this.historyService.saveAnalysis(saveAnalysisRequest).subscribe({
      next: res => {
        console.log('Analisi salvata:', res);
        this.terminated.emit();
        this.reset()
        this.router.navigate(['/dashboard']);
      },
      error: err => console.error('Errore nel salvataggio:', err)
    });
  }

  onDiscard() {
    this.terminated.emit();
    this.reset()
    this.router.navigate(['/dashboard']);
  }

  reset() {
  this.resultAnalysis= null;
  this.typeAnalysis = 0;
  this.history= undefined ;
  }
}
