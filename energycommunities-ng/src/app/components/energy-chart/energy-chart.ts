import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

@Component({
  selector: 'app-energy-chart',
  templateUrl: './energy-chart.html',
  styleUrls: ['./energy-chart.css', '../welcome/welcome.css'],
  imports: [BaseChartDirective],
  standalone: true
})
export class EnergyChartComponent implements OnInit {
  @Input() data!: ChartData<any>;
  @Input() options!: ChartOptions<any>;
  @Input() selectedChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) private chart?: BaseChartDirective;

  ngOnInit(): void {
    this.options = {
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

  public resetZoom(): void {
    this.chart?.chart?.resetZoom();
  }

  public zoomIn(): void {
    this.chart?.chart?.zoom(1.1);
  }

  public zoomOut(): void {
    this.chart?.chart?.zoom(0.9);
  }
}
