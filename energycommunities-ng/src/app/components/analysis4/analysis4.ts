import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartConfiguration, ChartData, ChartOptions} from 'chart.js';
import { CommonModule } from '@angular/common';
import { EnergyChartComponent } from '../energy-chart/energy-chart';
import { MemberDetail } from '../../model/member/MemberDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalysisService } from '../../services/analysis.service';
import { AuthService } from '../../services/auth/auth.service';
import { GenerationLoader } from '../generation-loader/generation-loader';
import { HistoryService } from '../../services/history.service';
import {HistorySummary} from '../../model/history/HistorySummary';
import {FormsModule} from '@angular/forms';
import {AnalysisActionsComponent} from '../analysis-save/analysis-save';
import {ClingoEventsService} from '../../services/clingo-events.service';
import {User} from '../../model/User';
import {ResultAnalysis_4} from '../../model/analysis/ResultAnalysis_4';
import {BatteryInvestmentSummary} from '../../model/BatteryInvestmentSummary';
import {BatteryDto} from '../../model/battery/BatteryDto';
import {BaseChartDirective} from 'ng2-charts';
import {Analysis4Request} from '../../model/analysis/Analysis4Request';
import {ResultAnalysis_3} from '../../model/analysis/ResultAnalysis_3';

@Component({
  selector: 'app-analisys4',
  templateUrl: './analysis4.html',
  standalone: true,
  imports: [CommonModule, EnergyChartComponent, GenerationLoader, FormsModule, AnalysisActionsComponent, BaseChartDirective],
  styleUrls: ['./analysis4.css', '../analysis1/analysis1.css', '../welcome/welcome.css']
})
export class Analysis4 implements OnInit, OnDestroy {


  history : HistorySummary | undefined = undefined ;
  typeAnalisys : number = 4
  historyId: number | null  = null;

  resultAnalysis: ResultAnalysis_4 | null = null;
  memberExpandedState: Map<number, boolean> = new Map();

  // --- PARAMETRI DI INPUT ---
  energyCost : number | null = null ;
  batteryLifespan: number = 15;
  maxPaybackDesired: number = 10;
  degradationRate: number = 2.0;

  // --- VALIDAZIONE ERRORI ---
  inputErrors = {
    cost: false,
    lifespan: false,
    payback: false,
    degradation: false
  };

  chartDataMap: Map<number, ChartData<any>> = new Map();
  batteryMap: Map<number, ChartData<any>> = new Map();
  allBatteriesChart?: ChartData<any>;
  optConsProfChart?: ChartData<any>;
  optProdProfChart?: ChartData<any>;
  totalComparisonChartWBatteries?: ChartData<any>;
  totalComparisonChartWOBatteries?: ChartData<any>;
  kpiChartWBatteries?: ChartData<any>;
  kpiChartWOBatteries?: ChartData<any>;

  chartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (0-23)' } },
      y: { title: { display: true, text: 'Energy (kWh)' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };


  // DATI GRAFICO PAYBACK
  paybackChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  paybackChartOptions: ChartConfiguration<'line'>['options'] = {};

  kpiChartOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Hour (0-23)' } },
      y: {
        title: { display: true, text: 'Percentage (%)' },
        beginAtZero: true,
        suggestedMax: 100,
      }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  statusMessage = "Starting...";
  statusWarning: boolean = false;
  analysis4Request: Analysis4Request | undefined = undefined ;


  memberIds: number[] | undefined = undefined;

  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private analysisService: AnalysisService,
    private authService: AuthService,
    private historyService: HistoryService,
    private clingoEvents: ClingoEventsService
  ) {}

  summary: BatteryInvestmentSummary | null = null;

  updateSummary(): void {
    if (this.validateInputs()) {
      this.summary = this.calculateBatteryInvestmentSummary();
    }
  }

  // --- VALIDAZIONE ---
  validateInputs(): boolean {
    let isValid = true;

    // Reset errori
    this.inputErrors = { cost: false, lifespan: false, payback: false, degradation: false };

    // Costo: range 0 - 1
    if (this.energyCost === null || this.energyCost < 0 || this.energyCost > 1) {
      this.inputErrors.cost = true;
      isValid = false;
    }

    // Lifespan: >= 0 (idealmente >0, ma richiesto lower bound 0)
    if (this.batteryLifespan === null || this.batteryLifespan < 0) {
      this.inputErrors.lifespan = true;
      isValid = false;
    }

    // Payback: >= 0
    if (this.maxPaybackDesired === null || this.maxPaybackDesired < 0) {
      this.inputErrors.payback = true;
      isValid = false;
    }

    // Degradation: >= 0
    if (this.degradationRate === null || this.degradationRate < 0) {
      this.inputErrors.degradation = true;
      isValid = false;
    }

    return isValid;
  }


  ngOnInit() {
    this.resultAnalysis = history.state?.result ?? null;

    if(this.resultAnalysis != null) {
      this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
      this.resultAnalysis.assignments = new Map(
        Object.entries(history.state?.result.assignments).map(
          ([key, value]) => [Number(key), value as number]
        )
      );
      this.buildAllCharts();
      return;
    }

    this.route.queryParams.subscribe(params => {
       this.historyId = +params['historyId'];

      if (this.historyId) {
        this.historyService.getHistoryById(this.historyId).subscribe({
          next: history => {
            this.history = history;
            this.resultAnalysis = history.analysisData as ResultAnalysis_4;
            this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
            this.resultAnalysis.assignments = new Map(
              Object.entries(this.resultAnalysis.assignments).map(
                ([key, value]) => [Number(key), value as number]
              )
            );
            this.buildAllCharts();
          },
          error: err => console.error('Errore caricamento history:', err)
        });
      } else {
        this.clingoEvents.connect((eventName,analysisId) => {
          if (analysisId == -1) {
            if (eventName === 'GROUNDING_STARTED') {
              this.statusMessage = 'Grounding...';
            }
            if (eventName === 'GROUNDING_FINISHED') {
              this.statusMessage = 'Solving...';
              if (this.statusWarning) this.statusWarning = false
            }
            if (eventName === 'GROUNDING_STILL_RUNNING') {
              this.statusWarning = true
            }
          }
        });

        this.analysis4Request = this.analysisService.getAnalysisResult()

        if(this.analysis4Request){
          this.analysisService.getResultAnalysis_4(this.analysis4Request.members,this.analysis4Request.batteries,this.analysis4Request.budget).subscribe({
            next: (data) => {
              this.resultAnalysis = data;
              this.resultAnalysis.startingCommunity.assignments.forEach(m => this.memberExpandedState.set(m.id, false));
              this.resultAnalysis.assignments = new Map(
                Object.entries(data.assignments).map(
                  ([key, value]) => [Number(key), value as number]
                )
              );
              this.buildAllCharts();
            },
            error: (err) => console.error(err)
          });

        }
      }
    });
  }

  private initializeResult(result: ResultAnalysis_4) {
    result.startingCommunity.assignments.forEach(
      m => this.memberExpandedState.set(m.id, false)
    );

    result.assignments = new Map(
      Object.entries(result.assignments).map(
        ([k, v]) => [Number(k), v as number]
      )
    );

    this.buildAllCharts();
  }


  ngOnDestroy() {
    if (this.clingoEvents) this.clingoEvents.disconnect();
  }

  toggleMember(memberId: number) {
    const currentState = this.memberExpandedState.get(memberId) || false;
    this.memberExpandedState.set(memberId, !currentState);
  }

  isMemberExpanded(memberId: number): boolean {
    return this.memberExpandedState.get(memberId) || false;
  }

  calculateBatteryInvestmentSummary(): BatteryInvestmentSummary | null {
    if (this.energyCost == null || this.energyCost <= 0 || !this.resultAnalysis) {
      return null;
    }

    // 1) Costi giornalieri base
    const dailyCostWithout = this.calculateCostCommunityWithoutEnergyPerDay();
    const dailyCostWith    = this.calculateCostCommunityWithBatteryPerDay();

    if (dailyCostWithout < 0 || dailyCostWith < 0) return null;

    // Investimento iniziale
    const batteries: BatteryDto[] = this.resultAnalysis.batteries || [];
    let batteryInvestment = 0;
    for (const battery of batteries) {
      batteryInvestment += battery.price || 0;
    }

    // Risparmio base (Anno 1)
    const annualCostWithout = dailyCostWithout * 365;
    const initialAnnualCostWith = dailyCostWith * 365;
    const initialAnnualSavings = annualCostWithout - initialAnnualCostWith;

    let paybackYears: number | null = null;
    let isConvenient = false;

    // --- CALCOLO CURVA CUMULATIVA CON DEGRADAZIONE ---
    const labels: string[] = [];
    const cumulativeSavings: number[] = [];
    const investmentLine: number[] = [];

    let currentSavings = initialAnnualSavings;
    let accumulated = 0;
    let foundPayback = false;

    // Proiettiamo fino a Lifespan + 5 anni per vedere cosa succede dopo
    const projectionYears = this.batteryLifespan + 5;

    for (let year = 1; year <= projectionYears; year++) {
      // Se la batteria è ancora viva, aggiungiamo risparmio
      if (year <= this.batteryLifespan) {
        accumulated += currentSavings;
        // Applichiamo degradazione per l'anno prossimo
        currentSavings = currentSavings * (1 - (this.degradationRate / 100));
      }
      // Se year > batteryLifespan, accumulated rimane costante (batteria morta)

      labels.push(`${year}`);
      cumulativeSavings.push(+accumulated.toFixed(2));
      investmentLine.push(batteryInvestment);

      // Check punto di payback
      if (!foundPayback && accumulated >= batteryInvestment) {
        // Payback avvenuto in questo anno.
        // Per precisione decimale: quanto mancava all'inizio dell'anno / risparmio di quest'anno
        const prevAccumulated = accumulated - (year <= this.batteryLifespan ? (currentSavings / (1 - (this.degradationRate/100))) : 0);
        const remainder = batteryInvestment - prevAccumulated;
        // (remainder / actualSavingsThisYear) + (year - 1)
        // Approssimazione semplice all'anno corrente per sicurezza UI
        paybackYears = year;
        foundPayback = true;
      }
    }

    // Se non abbiamo mai raggiunto l'investimento, payback rimane null
    if (!foundPayback) {
      paybackYears = null;
    }

    // --- LOGICA CONVENIENZA AVANZATA ---
    if (paybackYears !== null) {
      const withinLifespan = paybackYears <= this.batteryLifespan;
      const withinUserDesire = paybackYears <= this.maxPaybackDesired;

      // È conveniente se rientra prima di morire E prima del tempo desiderato
      isConvenient = withinLifespan && withinUserDesire;
    } else {
      isConvenient = false;
    }

    // Costruiamo l'oggetto summary
    // Nota: annualSavings nel summary mostra quello del PRIMO anno come riferimento
    const summary: BatteryInvestmentSummary = {
      annualCostWithoutBattery: annualCostWithout,
      annualCostWithBattery: initialAnnualCostWith,
      annualSavings: initialAnnualSavings,
      batteryInvestment,
      paybackYears,
      isConvenient,
    };

    // --- COSTRUZIONE GRAFICO ---
    this.paybackChartData = {
      labels,
      datasets: [
        {
          label: 'Cumulative Savings (w/ degradation)',
          data: cumulativeSavings,
          fill: false,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 2,
          borderColor: 'rgba(12,117,27,1)',
          backgroundColor: 'rgba(12,117,27,0.3)'
        },
        {
          label: 'Battery Investment',
          data: investmentLine,
          fill: false,
          tension: 0,
          borderDash: [8, 5],
          borderWidth: 2,
          pointRadius: 0,
          borderColor: 'rgba(220,53,69,1)',
          backgroundColor: 'rgba(220,53,69,0.3)'
        }
      ]
    };

    this.paybackChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const val = ctx.parsed.y;
              return `${ctx.dataset.label}: ${val.toLocaleString('it-IT', { maximumFractionDigits: 0 })} €`;
            }
          }
        },
        annotation: {
          // Qui potresti aggiungere annotazioni extra se installi chartjs-plugin-annotation
        }
      },
      scales: {
        y: {
          title: { display: true, text: '€' },
          ticks: { callback: (value: any) => `${value} €` }
        },
        x: {
          title: { display: true, text: 'Years' },
          grid: {
            color: (context: { tick: { label: string; }; }) => {
              // Evidenzia l'anno di fine vita batteria
              if (context.tick.label == this.batteryLifespan.toString()) return 'rgba(255, 0, 0, 0.5)';
              return 'rgba(0, 0, 0, 0.1)';
            },
            lineWidth: (context: { tick: { label: string; }; }) => {
              if (context.tick.label == this.batteryLifespan.toString()) return 2;
              return 1;
            }
          }
        }
      }
    } as any;

    return summary;
  }


  calculateCostCommunityWithoutEnergyPerDay(): number {
    if (!this.resultAnalysis || !this.energyCost) return -1;

    const consumptions = this.resultAnalysis.startingCommunity.totalConsumption;
    const productions  = this.resultAnalysis.startingCommunity.totalProduction;

    let importedEnergyPerDay = 0;
    for (let i = 0; i < 24; i++) {
      const consT = consumptions[i] ?? 0;
      const prodT = productions[i] ?? 0;
      if (consT > prodT) {
        importedEnergyPerDay += (consT - prodT);
      }
    }
    return importedEnergyPerDay * this.energyCost;
  }

  calculateCostCommunityWithBatteryPerDay(): number {
    if (!this.resultAnalysis || !this.energyCost) return -1;

    const consumptions = this.resultAnalysis.totalConsumption;
    const productions  = this.resultAnalysis.totalProduction;

    let importedEnergyPerDay = 0;
    for (let i = 0; i < 24; i++) {
      const consT = consumptions[i] ?? 0;
      const prodT = productions[i] ?? 0;
      if (consT > prodT) {
        importedEnergyPerDay += (consT - prodT);
      }
    }
    return importedEnergyPerDay * this.energyCost;
  }

  hasBattery(memberId: number): boolean {
    return this.resultAnalysis?.assignments?.has(memberId) ?? false;
  }

  getBatteryType(memberId: number): number | null {
    return this.resultAnalysis?.assignments?.get(memberId) ?? null;
  }

  buildAllCharts() {
    this.buildMemberCharts();
    this.buildAllBatteriesChart();
    this.buildOptConsProdProfChart();
    this.buildTotalComparisonChart();
    this.buildKpiChart();
  }

  buildMemberCharts() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    this.resultAnalysis.startingCommunity.assignments.forEach(member => {
      const producers = member.profiles.filter(p => p.profileType === 'PRODUCER');
      const consumers = member.profiles.filter(p => p.profileType === 'CONSUMER');
      const batteryStatuses = this.resultAnalysis?.batteryStatus;

      let graph: number[] = [];

      if(producers.length != 0) graph = [...producers[0].graph];

      const batteryStatus = batteryStatuses?.find(b => b.memberId == member.id);
      if (batteryStatus) {
        batteryStatus.energyByHour.forEach((value, index) => {
          if(index!=0) {
            const previousStatus = batteryStatus.energyByHour.at(index - 1);
            if (graph) {
              graph[index] = graph[index] - (value - (previousStatus ?? 0));
            }
          }
        });

        const batteryDataset = {
          label: "Battery State",
          data: batteryStatus.energyByHour,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25
        };
        this.batteryMap.set(member.id, { labels, datasets: [batteryDataset]});
      }

      const datasetsProducers = producers.map((p,index) => ({
        label: 'Producer Profile ' + p.id + " w/o battery",
        data: p.graph,
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
        tension: 0.25
      }));

      if(producers.length != 0 && batteryStatus != undefined) {
        datasetsProducers.push({
          label: 'Producer Profile ' + producers[0].id + " w/ battery",
          data: graph,
          borderColor: colors[1],
          backgroundColor: 'transparent',
          tension: 0.25
        })
      }

      const datasetsConsumers = consumers.map((p, index) => ({
        label: 'Consumer Profile ' + p.id,
        data: p.graph,
        borderColor: colors[(index + producers.length) % colors.length],
        backgroundColor: 'transparent',
        tension: 0.25
      }));
      this.chartDataMap.set(member.id, { labels, datasets: [...datasetsProducers, ...datasetsConsumers] });
    });
  }

  buildAllBatteriesChart() {
    if (!this.resultAnalysis || !this.resultAnalysis.batteryStatus) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    const datasets = this.resultAnalysis.batteryStatus.map((b, index) => {
      const member = this.resultAnalysis!.startingCommunity.assignments.find(m => m.id === b.memberId);
      const memberName = member ? member.fullName : "Member " + b.memberId;
      return {
        label: memberName + "'s Battery",
        data: b.energyByHour,
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
      };
    });
    this.allBatteriesChart = { labels, datasets };
  }

  buildOptConsProdProfChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'black', 'brown'];

    const datasetsConsumers: any[] = [];
    const datasetsProducers: any[] = [];

    this.resultAnalysis.startingCommunity.assignments.forEach((member, index) => {
      const consumer = member.profiles.find(p => p.profileType === 'CONSUMER');
      const producer = member.profiles.find(p => p.profileType === 'PRODUCER');

      if (consumer) {
        datasetsConsumers.push({
          label: member.fullName,
          data: consumer.graph,
          borderColor: colors[index % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
      if (producer) {
        datasetsProducers.push({
          label: member.fullName,
          data: producer.graph,
          borderColor: colors[(index + member.profiles.filter(p => p.profileType === 'PRODUCER').length) % colors.length],
          backgroundColor: 'transparent',
          tension: 0.25
        });
      }
    });
    this.optConsProfChart = { labels, datasets: datasetsConsumers };
    this.optProdProfChart = { labels, datasets: datasetsProducers };
  }

  buildTotalComparisonChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.totalComparisonChartWBatteries = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };

    this.totalComparisonChartWOBatteries = {
      labels,
      datasets: [
        {
          label: 'Total Production',
          data: this.resultAnalysis.startingCommunity.totalProduction,
          borderColor: 'red',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Total Consumption',
          data: this.resultAnalysis.startingCommunity.totalConsumption,
          borderColor: 'green',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };
  }

  buildKpiChart() {
    if (!this.resultAnalysis) return;
    const labels = Array.from({ length: 24 }, (_, i) => i.toString());

    this.kpiChartWBatteries = {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.kpi2,
          borderColor: 'orange',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };

    this.kpiChartWOBatteries = {
      labels,
      datasets: [
        {
          label: 'Shared Energy (KPI1)',
          data: this.resultAnalysis.startingCommunity.kpi1,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.25,
        },
        {
          label: 'Self-Sufficiency (KPI2)',
          data: this.resultAnalysis.startingCommunity.kpi2,
          borderColor: 'orange',
          backgroundColor: 'transparent',
          tension: 0.25,
        }
      ]
    };
  }

  getMemberTypeLabel(member: MemberDetail): string {
    const hasProducer = member.profiles.some(p => p.profileType === 'PRODUCER');
    const hasConsumer = member.profiles.some(p => p.profileType === 'CONSUMER');
    if (hasProducer && hasConsumer) return 'Prosumer';
    if (hasProducer) return 'Producer';
    return 'Consumer';
  }

  resetAnalysisData() {
    if (this.resultAnalysis) {
      this.resultAnalysis.startingCommunity.assignments = [];
      this.resultAnalysis.startingCommunity.kpi1 = [];
      this.resultAnalysis.startingCommunity.kpi2 = [];
      this.resultAnalysis.startingCommunity.totalConsumption = [];
      this.resultAnalysis.startingCommunity.totalProduction = [];
      this.resultAnalysis.kpi1 = [];
      this.resultAnalysis.kpi2 = [];
      this.resultAnalysis.totalConsumption = [];
      this.resultAnalysis.totalProduction = [];
    }

    this.memberExpandedState.clear();
    this.chartDataMap.clear();
    this.optConsProfChart = undefined;
    this.optProdProfChart = undefined;
    this.totalComparisonChartWBatteries = undefined;
    this.totalComparisonChartWOBatteries = undefined;
    this.kpiChartWBatteries = undefined;
    this.kpiChartWOBatteries = undefined;
  }

  runAnalysisAsync() {
    const memberIds = this.memberIds;
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) return;
    const user: User = JSON.parse(userJson);
    this.analysisService.runAsync1(user.id, 1, memberIds).subscribe(id => {
      this.router.navigate(['/ongoing-analysis']);
    });
  }
}
