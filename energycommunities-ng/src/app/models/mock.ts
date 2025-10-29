import { User, Plan, Member, Profile, ProfileGraph } from './models';

// Funzione per generare un array di 24 valori casuali tra 0 e 10
function generateRandomGraph(): number[] {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 10));
}

// Crea profili mock
const profile1: Profile = {
  id: 1,
  type: 'PRODUCER',
  profileGraph: { graph: generateRandomGraph() }
};

const profile2: Profile = {
  id: 2,
  type: 'CONSUMER',
  profileGraph: { graph: generateRandomGraph() }
};

const profile3: Profile = {
  id: 3,
  type: 'CONSUMER',
  profileGraph: { graph: generateRandomGraph() }
};

// Crea membri mock
export const member1: Member = {
  id: 1,
  fullName: 'Mario Rossi',
  memberType: 'PROSUMER', // ha profilo producer e consumer
  profiles: [profile1, profile2, profile3]
};

const member2: Member = {
  id: 2,
  fullName: 'Luigi Bianchi',
  memberType: 'CONSUMER',
  profiles: [profile3]
};

// Crea Plan mock
const mockPlan: Plan = {
  id: 100,
  members: [member1, member2]
};

// Crea User mock
export const mockUser: User = {
  id: 999,
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  email: 'test@example.com',
  plan: mockPlan
};
