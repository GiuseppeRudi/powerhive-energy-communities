import {Member} from './models';

export interface Plan {
  id: number;
  members: Member[];
}
