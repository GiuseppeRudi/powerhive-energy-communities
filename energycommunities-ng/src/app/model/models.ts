import {ProfileType} from '../utils/enum/ProfileType';


export interface ProfileGraph {
  graph: number[];
}

export interface Profile {
  id: number;
  type: ProfileType;
  profileGraph: ProfileGraph;
}





