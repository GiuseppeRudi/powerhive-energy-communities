% A consumer is someone who has at least a consumption profile
consumer(P) :- profile(P,_,_,_).
consumer_profile(P, I) :- profile(P,I,_,_).
time(T) :- profile(_,_,T,_).

% Assign one profile to each consumer
{ assign(P,I): consumer_profile(P,I) } = 1 :- consumer(P).

% Total Consumption
consumer_consumption(T,V) :- time(T), V = #sum{K,P: assign(P,I), profile(P,I,T,K)}.

% Total Production
producer_production(T,V) :- time(T), V = #sum{K,P: production(P,T,K)}.

%% Batteries
%%
%% producer(P) :- production(P,_,_).
%% charge_state(P, 0, 0).
%% charge_delta(P, 10).			%%%% charge_delta(P, LB, UB, K); if charge in [LB, UB) +K
%% discharge_delta(P, 10).		%%%% discharge_delta(P, LB, UB, K); if charge in [LB,UB) -K
%% { action(P,T,no_op); action(P,T,charge); action(P,T,discharge) } = 1.
%% :- action(P,T,charge), ...batteria già carica...
%% :- action(P,T,discharge), ...batteria troppo scarica...
%%
%% Effetto + Inerzia per la batteria
%% charge_state(P,T,S+K) :- charge_state(P,T-1,S), action(P,T,charge), charge_delta(P,K).
%% charge_state(P,T,S-K) :- charge_state(P,T-1,S), action(P,T,discharge), discharge_delta(P,K).
%% charge_state(P,T,S) :- charge_state(P,T-1,S), action(P,T,no_op).
%%
%% Battery strategy induces an extra consumption profile + an extra production profile
%% profile(battery(P),0,T,0) :- not action(P,T,charge), time(T), producer(P).
%% profile(battery(P),0,T,K) :- action(P,T,charge), charge_delta(P, K).
%%
%% production(battery(P),0,T,K) :- not action(P,T,discharge), time(T), producer(P).
%% production(battery(P),0,T,K) :- action(P,T,discharge), discharge_delta(P,K).

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
