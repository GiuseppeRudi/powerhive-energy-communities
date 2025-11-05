% member(MemberId,PlanId,MemberType)
% profile(ProfileId,MemberId,ProfileType)
% profileGraph(MemberId,ProfileId,Hour,Value)

time(T) :- profileGraph(_,_,T,_).

% Profile Assignment
{ assign(M,P) : profile(P,M,consumer) } = 1 :- member(M,_,MT), MT != producer.
{ assign(M,P) : profile(P,M,producer) } = 1 :- member(M,_,MT), MT != consumer.

consumers_consumption_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M,P), profile(P,M,consumer), profileGraph(M,P,T,Value)}.

producers_production_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M,P), profile(P,M,producer), profileGraph(M,P,T,Value)}.

energy_snapshot(T,A,B-A) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A > B.

max_gap(K) :- K = #max{0; Z : energy_snapshot(_,_,Z)}.

surplus_energy_per_member(M,T,Value2-Value1) :-
    assign(M,P1), assign(M,P2), P1<P2,
    profileGraph(M,P1,T,Value1),
    profileGraph(M,P2,T,Value2),
    Value1<=Value2.
surplus_energy_per_member(M,T,Value1-Value2) :-
    assign(M,P1), assign(M,P2), P1<P2,
    profileGraph(M,P1,T,Value1),
    profileGraph(M,P2,T,Value2),
    Value1>Value2.

% vincoli deboli per minimizzare gap
:~ max_gap(K). [K@3] % minimizza il gap maggiore
:~ surplus_energy_per_member(M,T,S). [S@2,T] % massimizzare l'autoconsumo
:~ energy_snapshot(T,_,K). [K@1,T] % minimizza il bilancio totale (efficienza)

% misura quanta parte dell’energia prodotta viene effettivamente usata (0–100%)
kpi_1(T,100*A/B) :- energy_snapshot(T,A,_), producers_production_per_hour(T,B), B != 0.
% misura quanta parte del consumo totale è soddisfatta da produzione interna.
kpi_2(T,100*A/B) :- energy_snapshot(T,A,_), consumers_consumption_per_hour(T,B), B != 0.


#show assign/2.
%#show profile/3.
%#show consumers_consumption_per_hour/2.
%#show producers_production_per_hour/2.
%#show energy_snapshot/3.
#show kpi_1/2.
#show kpi_2/2.