export interface OngoingAnalysis {
  id: number;
  userId: number;
  analysisType: number;
  status: 'PENDING' | 'RUNNING' | 'FINISHED' | 'ERROR';
  createdAt: string;
}
