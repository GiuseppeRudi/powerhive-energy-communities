import {SingleAnalysis} from './analysis/SingleAnalysis';

export interface CommunityData {
  community: SingleAnalysis;
  title: string;
  icon: string;
  iconColor: string;
  showRemoved: boolean;
  showLegend: boolean;
}
