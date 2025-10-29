export type MemberType = 'PRODUCER' | 'CONSUMER' | 'PROSUMER';
export type ProfileType = 'PRODUCER' | 'CONSUMER';

export interface ProfileGraph {
  graph: number[];
}

export interface Profile {
  id: number;
  type: ProfileType;
  profileGraph: ProfileGraph;
}

export interface Member {
  id: number;
  fullName: string;
  memberType: MemberType;
  profiles: Profile[];
}

export interface Plan {
  id: number;
  members: Member[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  plan: Plan;
}
