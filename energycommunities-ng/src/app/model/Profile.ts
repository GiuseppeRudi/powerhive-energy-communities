import {ProfileType} from '../utils/enum/ProfileType';

export interface Profile {
  id: number;
  profileType: ProfileType;
  graph: number[];
}
