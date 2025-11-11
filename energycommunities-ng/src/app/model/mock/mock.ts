import { Profile } from '../member/Profile';
import { User } from '../User';
import { PlanSummary } from '../plan/PlanSummary';
import { MemberDetail } from '../member/MemberDetail';
import { PlanDetail } from '../plan/PlanDetail';

function generateProductionProfile(): number[] {
  return [
    0, 0, 0, 0, 0, 0,
    5, 15, 30, 50, 70, 85,
    100, 95, 85, 70, 50, 30,
    15, 5, 0, 0, 0, 0
  ];
}

function generateConsumptionProfile(): number[] {
  return [
    20, 15, 15, 15, 20, 30,
    50, 60, 70, 50, 40, 35,
    30, 30, 30, 35, 40, 50,
    70, 80, 90, 70, 50, 30
  ];
}

function generateKpiSelfSufficiency(): number[] {
  return [
    30, 25, 25, 25, 30, 40,
    60, 70, 80, 85, 90, 95,
    100, 98, 95, 90, 80, 70,
    60, 50, 40, 35, 32, 30
  ];
}

function generateKpiSharedEnergy(): number[] {
  return [
    10, 8, 8, 8, 10, 15,
    30, 45, 60, 75, 85, 90,
    95, 92, 88, 80, 70, 55,
    40, 25, 15, 12, 11, 10
  ];
}

export const kpi1: number[] = generateKpiSelfSufficiency();
export const kpi2: number[] = generateKpiSharedEnergy();

const profile1: Profile = {
  id: 1,
  profileType: 'PRODUCER',
  graph: generateProductionProfile()
};

const profile2: Profile = {
  id: 2,
  profileType: 'CONSUMER',
  graph: generateConsumptionProfile()
};

const profile3: Profile = {
  id: 3,
  profileType: 'PRODUCER',
  graph: generateProductionProfile().map(v => v * 0.7)
};

const profile4: Profile = {
  id: 4,
  profileType: 'CONSUMER',
  graph: generateConsumptionProfile().map(v => v * 1.2)
};

const profile5: Profile = {
  id: 5,
  profileType: 'CONSUMER',
  graph: generateConsumptionProfile().map(v => v * 0.5) // Basso consumo
};

const profile6: Profile = {
  id: 6,
  profileType: 'PRODUCER',
  graph: generateProductionProfile().map(v => v * 1.5) // Alta produzione
};

const profile7: Profile = {
  id: 7,
  profileType: 'CONSUMER',
  graph: generateConsumptionProfile().map(v => v * 0.9) // Consumo leggermente inferiore
};

const profile8: Profile = {
  id: 8,
  profileType: 'PRODUCER',
  graph: generateProductionProfile().map(v => v * 0.2) // Bassa produzione
};

const profile9: Profile = {
  id: 9,
  profileType: 'CONSUMER',
  graph: generateConsumptionProfile().map(v => v * 1.5) // Alto consumo
};

const profile10: Profile = {
  id: 10,
  profileType: 'PRODUCER',
  graph: generateProductionProfile().map(v => v * 1.1) // Produzione leggermente superiore
};

// Membri mock
export const member1: MemberDetail = {
  id: 1,
  fullName: 'Mario Rossi',
  memberType: 'PROSUMER',
  profiles: [profile1, profile2]
};

export const member2: MemberDetail = {
  id: 2,
  fullName: 'Luigi Bianchi',
  memberType: 'CONSUMER',
  profiles: [profile2]
};

export const member3: MemberDetail = {
  id: 3,
  fullName: 'Anna Verdi',
  memberType: 'PRODUCER',
  profiles: [profile3]
};

export const member4: MemberDetail = {
  id: 4,
  fullName: 'Giuseppe Neri',
  memberType: 'PROSUMER',
  profiles: [profile3, profile4]
};

export const member5: MemberDetail = {
  id: 5,
  fullName: 'Francesca Gialli',
  memberType: 'CONSUMER',
  profiles: [profile5]
};

export const member6: MemberDetail = {
  id: 6,
  fullName: 'Roberto Marroni',
  memberType: 'PRODUCER',
  profiles: [profile6]
};

export const member7: MemberDetail = {
  id: 7,
  fullName: 'Silvia Viola',
  memberType: 'PROSUMER',
  profiles: [profile6, profile7]
};

export const member8: MemberDetail = {
  id: 8,
  fullName: 'Andrea Arancioni',
  memberType: 'PROSUMER',
  profiles: [profile8, profile9]
};

export const member9: MemberDetail = {
  id: 9,
  fullName: 'Paolo Bianchi',
  memberType: 'CONSUMER',
  profiles: [profile7]
};

export const member10: MemberDetail = {
  id: 10,
  fullName: 'Elena Neri',
  memberType: 'PRODUCER',
  profiles: [profile10]
};

export const member11: MemberDetail = {
  id: 11,
  fullName: 'Davide Azzurri',
  memberType: 'PROSUMER',
  profiles: [profile10, profile5]
};

export const member12: MemberDetail = {
  id: 12,
  fullName: 'Chiara Rosa',
  memberType: 'CONSUMER',
  profiles: [profile9]
};

export const mockPlan: PlanDetail = {
  id: 100,
  members: [member1, member2, member3, member4, member5, member6, member7, member8, member9, member10, member11, member12]
};

export const mockUser: User = {
  id: 999,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
  email: 'test@example.com',
  plan_id: 1,
};
