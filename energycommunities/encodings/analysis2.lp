% member(MemberId,PlanId,MemberType)
% profile(ProfileId,MemberId,ProfileType)
% profileGraph(MemberId,ProfileId,Hour,Value)
% dimCommunity(Dim)

time(T) :- profileGraph(_,_,T,_).

% Profile Assignment
{assign(M) : member(M,_,_)} = N :- dimCommunity(N).

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