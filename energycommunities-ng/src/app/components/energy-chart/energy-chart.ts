import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables, zoomPlugin);

@Component({
  selector: 'app-energy-chart',
  templateUrl: './energy-chart.html',
  styleUrls: ['./energy-chart.css', '../welcome/welcome.css'],
  imports: [BaseChartDirective, FormsModule],
  standalone: true
})
export class EnergyChartComponent implements OnInit, OnChanges {
  @Input() data!: ChartData<any>;
  @Input() options!: ChartOptions<any>;
  @Input() selectedChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) private chart?: BaseChartDirective;

  public displayData!: ChartData<any>;
  public chartOptions!: ChartOptions<any>;

  private readonly defaultIntervalSize = 30;
  public intervalSize = this.defaultIntervalSize;
  public currentIntervalIndex = -1; // -1 represents the full view
  public totalIntervals = 0;

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.initializeData();
    }
    if (changes['options'] && !changes['options'].firstChange) {
      this.chartOptions = this.getChartOptions();
    }
  }

  private getChartOptions(): ChartOptions<any> {
    return {
      ...this.options,
      plugins: {
        ...(this.options?.plugins || {}),
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            wheel: {
              enabled: false,
              speed: 0.05
            },
            pinch: {
              enabled: false
            },
            mode: 'xy',
          }
        }
      }
    };
  }

  private initializeData(): void {
    if (this.data && this.data.labels?.length) {
      // Always work with a copy of the data to avoid mutating the @Input property.
      this.displayData = {
        labels: [...this.data.labels],
        datasets: this.data.datasets.map(ds => ({ ...ds, data: [...ds.data] }))
      };
      this.totalIntervals = Math.ceil(this.data.labels.length / this.intervalSize); // For when panning starts from full view
      this.currentIntervalIndex = -1; // Start in full view mode
    } else {
      this.displayData = { labels: [], datasets: [] };
      this.totalIntervals = 0;
      this.currentIntervalIndex = -1;
    }
  }

  public pan(direction: 'next' | 'prev'): void {
    // If totalIntervals isn't calculated or there's only one, do nothing.
    if (this.totalIntervals <= 1) {
      return;
    }

    if (this.currentIntervalIndex === -1) {
      this.currentIntervalIndex = direction === 'next' ? 0 : this.totalIntervals - 1;
    } else if (direction === 'next' && this.currentIntervalIndex < this.totalIntervals - 1) {
      this.currentIntervalIndex++;
    } else if (direction === 'prev' && this.currentIntervalIndex > 0) {
      this.currentIntervalIndex--;
    }

    this.updateDisplayData();
  }

  private updateDisplayData(): void {
    if (this.currentIntervalIndex === -1 || !this.data.labels) {
      // This case is handled by initializeData, which shows the full chart.
      // This method should only be called for paged views.
      return;
    }

    const startIndex = this.currentIntervalIndex * this.intervalSize;
    const endIndex = startIndex + this.intervalSize;

    this.displayData = {
      labels: this.data.labels.slice(startIndex, endIndex),
      datasets: this.data.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.slice(startIndex, endIndex)
      }))
    };

    this.chart?.chart?.resetZoom('none'); // Reset zoom when panning
    this.chart?.update();
  }

  public applyIntervalFilter(numberOfHours: number): void {
    if (!this.data || !this.data.labels) {
      return;
    }

    // Assuming hourly data based on user feedback (e.g., 1 data point per hour).
    // Change this value if your data has a different frequency (e.g., 4 for 15-min intervals).
    const pointsPerHour = 1;
    this.intervalSize = numberOfHours * pointsPerHour;

    // Recalculate total intervals based on the new size
    this.totalIntervals = Math.ceil(this.data.labels.length / this.intervalSize);

    // Start at the first interval
    this.currentIntervalIndex = 0;

    // Update the chart to show the first interval
    this.updateDisplayData();
  }

  public resetView(): void {
    this.chart?.chart?.resetZoom();
    this.intervalSize = this.defaultIntervalSize; // Reset interval size to default
    this.initializeData(); // Re-initialize to restore the original state
    this.chart?.update();
  }

  public zoomIn(): void {
    this.chart?.chart?.zoom(1.1);
  }

  public zoomOut(): void {
    this.chart?.chart?.zoom(0.9);
  }
}
