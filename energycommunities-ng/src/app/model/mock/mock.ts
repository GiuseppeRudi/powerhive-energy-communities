import { Profile } from '../member/Profile';
import { User } from '../User';
import { Plan } from '../plan/Plan';
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

export const mockPlan: PlanDetail = {
  id: 100,
  members: [member1, member2, member3, member4]
};

export const mockUser: User = {
  id: 999,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
  email: 'test@example.com',
  plan_id: 1,
};

export function calculateTotals() {
  const totalProduction = new Array(24).fill(0);
  const totalConsumption = new Array(24).fill(0);

  mockPlan.members.forEach(member => {
    member.profiles.forEach(profile => {
      if (profile.profileType === 'PRODUCER') {
        profile.graph.forEach((value, hour) => {
          totalProduction[hour] += value;
        });
      } else if (profile.profileType === 'CONSUMER') {
        profile.graph.forEach((value, hour) => {
          totalConsumption[hour] += value;
        });
      }
    });
  });

  return { totalProduction, totalConsumption };
}
