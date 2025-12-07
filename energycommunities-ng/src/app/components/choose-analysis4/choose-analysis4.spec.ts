import { TestBed } from '@angular/core/testing';
import { ChooseAnalysis4 } from './choose-analysis4';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {HistoryService} from '../../services/history.service';
import {PlanService} from '../../services/plan.service';
import {BatteryService} from '../../services/battery.service';
import {AnalysisService} from '../../services/analysis.service';

describe('ChooseAnalysis4 Component', () => {

  let component: ChooseAnalysis4;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  const batteryServiceMock = {
    get_batteries_by_plan: () => of([])
  };

  const planServiceMock = {
    getDetailPlan: () => of({
      members: [
        { id: 1, profiles: [] },
        { id: 2, profiles: [] }
      ]
    })
  };

  const analysisServiceMock = {
    setAnalysisResult: jasmine.createSpy('setAnalysisResult')
  };

  const historyServiceMock = {
    getHistories: () => of([]),
    getHistoryMembers: () => of([])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChooseAnalysis4,
        { provide: Router, useValue: routerSpy },
        { provide: HistoryService, useValue: historyServiceMock },
        { provide: PlanService, useValue: planServiceMock },
        { provide: BatteryService, useValue: batteryServiceMock },
        { provide: AnalysisService, useValue: analysisServiceMock }
      ]
    });

    component = TestBed.inject(ChooseAnalysis4);
  });


  it('should toggle member selection', () => {
    component.energyCommunities = [];
    component.toggleSelection(5);
    expect(component.energyCommunities).toContain(5);

    component.toggleSelection(5);
    expect(component.energyCommunities).not.toContain(5);
  });

  it('should select and deselect all members', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;

    component.selectAll();
    expect(component.energyCommunities.length).toBe(2);

    component.deselectAll();
    expect(component.energyCommunities.length).toBe(0);
  });

  it('should detect full and partial selections', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;

    component.energyCommunities = [1, 2];
    expect(component.isAllSelected()).toBeTrue();

    component.energyCommunities = [1];
    expect(component.isIndeterminate()).toBeTrue();
  });


  it('should start analysis and navigate', () => {
    component.members = [{ id: 1 }, { id: 2 }] as any;
    component.plan_batteries = [{ id: 10 }] as any;

    component.energyCommunities = [1];
    component.batteriesList = [10];
    component.budget = 500;

    component.startAnalysis4();

    expect(analysisServiceMock.setAnalysisResult).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/analysis4']);
  });

});
