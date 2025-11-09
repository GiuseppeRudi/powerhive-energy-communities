import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {HistorySummary} from '../../model/history/HistorySummary'
import {HistoryService} from '../../services/history.service';
import {User} from '../../model/User';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hystory.html',
  styleUrls: ['./hystory.css']
})
export class HistoryComponent implements OnInit {
  historyList: HistorySummary[] = [];
  loading = true;
  error: string | null = null;
  userId : number = 0;

  constructor(
    private historyService: HistoryService, private router: Router,
  ) {}

  ngOnInit(): void {
    const userJson = sessionStorage.getItem('currentUser');

    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.userId = user.id;
    }

    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = null;

    this.historyService.getHistories(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.historyList = data;
        console.log(this.historyList);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della cronologia';
        this.loading = false;
        console.error(err);
      }
    });


  }

  viewAnalysis(historyId: number) {
    this.router.navigate(['/analysis1'], { queryParams: { historyId } });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

}
