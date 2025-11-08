import {ResultAnalysis_1} from './analysis/ResultAnalysis_1';

export interface Hystory {
  id: number;
  userId: number;
  analysisNumber: number;
  analysisData: ResultAnalysis_1 | null;
  createdAt: string;
}
