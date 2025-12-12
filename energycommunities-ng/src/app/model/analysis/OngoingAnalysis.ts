export interface OngoingAnalysis {
  id: number;
  userId: number;
  analysisType: number;
  status: 'PENDING' | 'RUNNING' | 'FINISHED' | 'ERROR';
  numMembers: number;
  numBatteries: number;
  createdAt: string;
  memberIds?: number[];
}
