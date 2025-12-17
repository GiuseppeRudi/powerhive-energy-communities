% Facts from Backend
% member(MemberId,MemberType)
% profile(MemberId,ProfileType,Hour, Value)
% budget(money)
% battery(id, capacity, cost)

amount(1..5).
time(0..23).

% Assign a battery to a member
{ assign(M,B) : battery(B,_,_) } <= 1 :- member(M,producer).
% :- assign(M1,B), assign(M2,B), M1!=M2.

% action that choose a specific battery
{ charge(B,M,T); discharge(B,M,T) } <= 1 :- assign(M,B), time(T).
nothing(B,M,T) :- assign(M,B), time(T), not charge(B,M,T), not discharge(B,M,T).


% for each battery B assign to a member M the battery start from time t with value 0
batteryStatusPerHour(B,M,0,0) :- assign(M,B).

% action charge for a battery B connected to member M is not possible if no have a production in that time t
:- charge(B,M,T), profile(M,producer,T,V), V=0.

% for each action from battery B and member M at time t choose a amount of charge (value 1 to 5)
{ charge_amt(B,M,T,A) : amount(A) } = 1 :- charge(B,M,T).

% effect of battery charge
batteryStatusPerHour(B,M,T,E2) :-
    batteryStatusPerHour(B,M,T-1,E1),
    T>0,
    charge_amt(B,M,T,A),
    E2 = E1 + A.
    
% it not possible to charge a battery with a specific amount A if the production P at time t if A > P
:- charge_amt(B,M,T,A), profile(M,producer,T,P), A>P.
   
% is not possible to charge a battery B connected to member M if the maximum capacity C is less than the current batteryStatusPerHour E plus the amount of charge A 
:- charge_amt(B,M,T,A),
   batteryStatusPerHour(B,M,T-1,E),
   T>0,
   battery(B,C,_),
   C < (E+A).

% for each action from battery B and member M at time t choose a amount of charge
{ discharge_amt(B,M,T,A) : amount(A) } = 1 :- discharge(B,M,T).

% effect of battery discharge
batteryStatusPerHour(B,M,T,E2) :-
    batteryStatusPerHour(B,M,T-1,E1),
    T>0,
    discharge_amt(B,M,T,A),
    E2 = E1 - A.

% is not possible to discharge a battery B connected to member M if the current energy E - the amount A is  < 0
:- discharge_amt(B,M,T,A),
   batteryStatusPerHour(B,M,T-1,E),
   T>0,
   battery(B,C,_),
   (E-A) < 0.

batteryStatusPerHour(B,M,T,E) :- nothing(B,M,T), batteryStatusPerHour(B,M,T-1,E), T>0.

% the sum of all  cost battery assign to a specific member is not greater to the budget
totalPrice(T) :- #sum{C,M: battery(B,_,C), assign(M,B)}=T.
:- budget(B), totalPrice(T), T > B.

consumers_consumption_per_hour(T,V) :-
    time(T),
    V1 = #sum { Value,M: profile(M,consumer,T,Value)},
    V2 = #sum { Value,M: assign(M,B), charge_amt(B,M,T,Value)},
    V = V1+V2.

producers_production_per_hour(T,V) :-
    time(T),
    V1 = #sum { Value,M: profile(M,producer,T,Value)},
    V2 = #sum { Value,M: assign(M,B), discharge_amt(B,M,T,Value)},
    V = V1+V2.

energy_snapshot(T,A,B-A) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A > B.

max_gap(K) :- K = #max{0; Z : energy_snapshot(_,_,Z)}.

% surplus_energy_per_member(M,T,Value2-Value1) :-
%     profile(M,producer,T,Value1),
%     profile(M,consumer,T,Value2),
%     Value1<=Value2.

% surplus_energy_per_member(M,T,Value1-Value2) :-
%     profile(M,producer,T,Value1),
%     profile(M,consumer,T,Value2),
%     Value1>Value2.

% vincoli deboli per minimizzare gap
:~ max_gap(K). [K@3] % minimizza il gap maggiore
:~ energy_snapshot(T,_,K). [K@2,T] % minimizza il bilancio totale (efficienza)
:~ totalPrice(T). [T@1] % i prefer to choose a best combinations that minimize the cost of all batteries

% :~ producers_production_per_hour(T,P), consumers_consumption_per_hour(T,C). [C-P@2,T]
% :~ surplus_energy_per_member(M,T,S). [S@1,M,T] % massimizzare l'autoconsumo

#show consumers_consumption_per_hour/2.
#show producers_production_per_hour/2.
%#show energy_snapshot/3.

#show assign/2.
#show batteryStatusPerHour/4.
#show battery/3.