import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

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
  @Input() not_a_line_chart: boolean = false;
  @Input() isEnergy: boolean = true;
  @Input() isBattery: boolean = false;
  @Input() showControls: boolean = true;

  @ViewChild(BaseChartDirective) private chart?: BaseChartDirective;

  public displayData!: ChartData<any>;
  public chartOptions!: ChartOptions<any>;

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
      }
    };
  }

  private initializeData(): void {
    if (this.data && this.data.labels?.length) {
      this.displayData = {
        labels: [...this.data.labels],
        datasets: this.data.datasets.map(ds => ({ ...ds, data: [...ds.data] }))
      };
    } else {
      this.displayData = { labels: [], datasets: [] };
    }
  }

  public applyIntervalFilter(numberOfHours: number): void {
    if (!this.data || !this.data.labels || !this.data.labels.length) {
      return;
    }

    const originalLabels = this.data.labels;
    const originalDatasets = this.data.datasets;


    const aggregatedLabels: any[] = [];
    const aggregatedDatasets = originalDatasets.map(ds => ({
      ...ds,
      data: [] as any[]
    }));

    for (let i = 0; i < originalLabels.length; i += numberOfHours) {
      const chunkEnd = Math.min(i + numberOfHours, originalLabels.length);

      aggregatedLabels.push(originalLabels[i] + "-" + originalLabels[chunkEnd - 1]);

      if(this.isBattery){
        originalDatasets.forEach((dataset, datasetIndex) => {
          aggregatedDatasets[datasetIndex].data.push(dataset.data[chunkEnd - 1]);
        });
        continue;
      }

      originalDatasets.forEach((dataset, datasetIndex) => {
        const dataChunk = (dataset.data as number[]).slice(i, chunkEnd);
        if (dataChunk.length > 0) {
          const sum = dataChunk.reduce((acc, value) => acc + (value || 0), 0);
          aggregatedDatasets[datasetIndex].data.push(sum);
        }
      });
    }

    this.displayData = {
      labels: aggregatedLabels,
      datasets: aggregatedDatasets
    };

    this.chart?.update();
  }

  public resetView(): void {
    this.initializeData();
    this.chart?.update();
  }
}
