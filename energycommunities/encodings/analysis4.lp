% member(MemberId,MemberType)
% profile(ProfileId,MemberId,ProfileType)
% profileGraph(MemberId,ProfileId,Hour,Value)
% wantToAdd(MemberId)
% wantToRemove(MemberId)


% budget(money)
% battery(id, capacity, cost)
value(1..5).



time(T) :- profileGraph(_,_,T,_).

% Assign a battery to a member
{assign(M): member(M,_), wantToRemove(M)} <= N :- #count{I: wantToRemove(I)} = N.

% Is not possible to assign a battery for a consumer


% the sum of all  cost battery assign to a specific member is not greater to the budget

% i prefer to choose a best combinations that minimize the cost of all batteries


% CONSIDERATIONS
% the batteries is assign to a specific member and the action of this battery is connected to
% a profile battery utils for visualizing in front end the battery work .

% the profile battery change for each time steps the profile of the assign batteries member, this is important for
% reflect the impact of the battery in the total consumptions and productions for the energy community

%% Battery strategy induces an extra consumption profile + an extra production profile
%% profile(battery(P),T,0) :- not action(P,T,charge), time(T), producer(P).
%% profile(battery(P),T,K) :- action(P,T,charge), charge_delta(P, K).

% modify the following code for use the specific profile battery to adapt the production or consuptions profile for the assign battery's member
%% production(battery(P),T,0) :- not action(P,T,discharge), time(T), producer(P).
%% production(battery(P),T,K) :- action(P,T,discharge), discharge_delta(P,K).


consumers_consumption_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M), profile(P,M,consumer), profileGraph(M,P,T,Value)}.

producers_production_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M), profile(P,M,producer), profileGraph(M,P,T,Value)}.

energy_snapshot(T,A,B-A) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A > B.

max_gap(K) :- K = #max{0; Z : energy_snapshot(_,_,Z)}.

surplus_energy_per_member(M,T,Value2-Value1) :-
    assign(M), P1<P2,
    profileGraph(M,P1,T,Value1),
    profileGraph(M,P2,T,Value2),
    Value1<=Value2.
surplus_energy_per_member(M,T,Value1-Value2) :-
    assign(M), P1<P2,
    profileGraph(M,P1,T,Value1),
    profileGraph(M,P2,T,Value2),
    Value1>Value2.

% vincoli deboli per minimizzare gap
:~ max_gap(K). [K@4] % minimizza il gap maggiore
:~ energy_snapshot(T,_,K). [K@3,T] % minimizza il bilancio totale (efficienza)
:~ producers_production_per_hour(T,P), consumers_consumption_per_hour(T,C). [C-P@2,T]
:~ surplus_energy_per_member(M,T,S). [S@1,M,T] % massimizzare l'autoconsumo

%#show consumers_consumption_per_hour/2.
%#show producers_production_per_hour/2.
%#show energy_snapshot/3.
#show assign/1.



#const steps=24.
time(0..steps-1).

% CER Cumulative Production:  production(0,T,C).
% CER Cumulative Consumption: consumption(0,T,C).

% production(M,T,X)
% consumption(M,T,X)
% simon(M) :- simon_ub(M,T,_)
% simon(M) :- simon_lb(M,T,_)

% A consumer is someone who has at least a consumption profile
consumer(P) :- profile(P,_,_,_).
consumer_profile(P, I) :- profile(P,I,_,_).
time(T) :- profile(_,_,T,_).

% Assign one profile to each consumer
{ simon_request(M,T,K): consumption(M,T,C) } = 1 :- simon(M), time(T), simon_ub(M,T,UB), simon_lb(M,T,LB).

% Total Consumption
consumer_consumption(T,V) :- time(T), V = #sum{K,P: assign(P,I), profile(P,I,T,K)}.

% Total Production
producer_production(T,V+W) :- time(T), V = #sum{K,P: production(P,T,K)}, W = #sum{K,P: production(battery(P),T,K}.

% assign/2 -- assign(B, P)

%% Batteries
%%
%% producer(P) :- production(P,_,_).
%% charge_state(P, 0, 0).
%% charge_delta(P, 10).			%%%% charge_delta(P, LB, UB, K); if charge in [LB, UB) +K
%% discharge_delta(P, 10).		%%%% discharge_delta(P, LB, UB, K); if charge in [LB,UB) -K


%% Versione batteria "dumb" (non la controlla nessuno, si comporta in modo fisso)
%% action(P,T,charge) :- charge_state(P,T,K), K < 50.
%% action(P,T,discharge) :- charge_state(P,T,K), K >= 50.
%% action(P,T,no_op) :- not action(P,T,charge), not action(P,T,discharge).

%% Versione batteria "smart" (la controlla il solver ASP)
%% { action(P,T,no_op); action(P,T,charge); action(P,T,discharge) } = 1.
%% :- action(P,T,charge), charge_state(P, T, K), charge_delta(P, H), K + H > 100. ...batteria già carica...
%% :- action(P,T,discharge), charge_state(P, T, K), discharge_delta(P, H), H > K. ...batteria troppo scarica...
%%
%% Effetto azioni batteria
%% charge_state(P,T,S+K) :- charge_state(P,T-1,S), action(P,T,charge), charge_delta(P,K).
%% charge_state(P,T,S-K) :- charge_state(P,T-1,S), action(P,T,discharge), discharge_delta(P,K).
%% charge_state(P,T,S) :- charge_state(P,T-1,S), action(P,T,no_op).
%%
%% Battery strategy induces an extra consumption profile + an extra production profile
%% profile(battery(P),T,0) :- not action(P,T,charge), time(T), producer(P).
%% profile(battery(P),T,K) :- action(P,T,charge), charge_delta(P, K).
%%
%% production(battery(P),T,0) :- not action(P,T,discharge), time(T), producer(P).
%% production(battery(P),T,K) :- action(P,T,discharge), discharge_delta(P,K).

% Shared Energy
% min(Production[t], Consumed[t])
energy_snapshot(T,A,B-A) :- consumer_consumption(T,A), producer_production(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumer_consumption(T,A), producer_production(T,B), A > B.

max_gap(K) :- K = #max{0; Z: energy_snapshot(_,_,Z)}.

:~ max_gap(K). [K@1]
:~ energy_snapshot(T,_,K). [K@2,T]

#show.
%#show energy_snapshot/3.
#show assign/2.

%                                      E_cond                   E_imm
#show kpi_1(T,@ratio(A,B)): energy_snapshot(T,A,_), producer_production(T,B).

%                                      E_cond                   E_prel
#show kpi_2(T,@ratio(A,B)): energy_snapshot(T,A,_), consumer_consumption(T,B).
