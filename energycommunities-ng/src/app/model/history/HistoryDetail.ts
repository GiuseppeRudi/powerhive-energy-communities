import { ResultAnalysis_1 } from '../analysis/ResultAnalysis_1';
import {ResultAnalysis_2} from '../analysis/ResultAnalysis_2';
import {ResultAnalysis_3} from '../analysis/ResultAnalysis_3';
import {ResultAnalysis_4} from '../analysis/ResultAnalysis_4';
// import { ResultAnalysis_2 } from './analysis/ResultAnalysis_2';
// import { ResultAnalysis_3 } from './analysis/ResultAnalysis_3';

export type ResultAnalysis = ResultAnalysis_1 | ResultAnalysis_2 | ResultAnalysis_3 | ResultAnalysis_4;

export interface HistoryDetail {
  id: number;
  name : string;
  analysisNumber: number;
  analysisData: ResultAnalysis | null;
  createdAt: string;
}
