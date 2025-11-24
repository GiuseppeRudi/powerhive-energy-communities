% member(MemberId,MemberType)
% profile(ProfileId,MemberId,ProfileType)
% profileGraph(MemberId,ProfileId,Hour,Value)
% budget(money)
% battery(id, capacity, cost)



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
#show battery/3.
#show budget/1.