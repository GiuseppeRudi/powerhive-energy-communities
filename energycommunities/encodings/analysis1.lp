% member(MemberId,MemberType)
% profile(ProfileId,MemberId,ProfileType)
% profileGraph(MemberId,ProfileId,Hour,Value)

time(0..23).

% Profile Assignment
{ assign(M,P) : profile(P,M,consumer) } = 1 :- member(M,MT), MT != producer.
{ assign(M,P) : profile(P,M,producer) } = 1 :- member(M,MT), MT != consumer.

consumers_consumption_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M,P), profile(P,M,consumer), profileGraph(M,P,T,Value)}.

producers_production_per_hour(T,V) :-
    time(T),
    V = #sum { Value,M: assign(M,P), profile(P,M,producer), profileGraph(M,P,T,Value)}.

energy_snapshot(T,A,B-A) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A > B.

max_gap(K) :- K = #max{0; Z : energy_snapshot(_,_,Z)}.

surplus_energy_per_member(M,T,S) :-
    assign(M,P1), assign(M,P2),
    profile(P1,M,producer),
    profile(P2,M,consumer),
    profileGraph(M,P1,T,V1),
    profileGraph(M,P2,T,V2),
    S = abs(V2 - V1).

% vincoli deboli per minimizzare gap
:~ max_gap(K). [K@4] % minimizza il gap maggiore
:~ energy_snapshot(T,_,K). [K@3,T] % minimizza il bilancio totale (efficienza)
:~ producers_production_per_hour(T,P), consumers_consumption_per_hour(T,C). [C-P@2,T]
:~ surplus_energy_per_member(M,T,abs(S)). [S@1,M,T] % massimizzare l'autoconsumo


% misura quanta parte dell’energia prodotta viene effettivamente usata (0–100%)
% kpi_1(T,100*A/B) :- energy_snapshot(T,A,_), producers_production_per_hour(T,B), B != 0.
% misura quanta parte del consumo totale è soddisfatta da produzione interna.
% kpi_2(T,100*A/B) :- energy_snapshot(T,A,_), consumers_consumption_per_hour(T,B), B != 0.


#show assign/2.
%#show profile/3.
%#show consumers_consumption_per_hour/2.
%#show producers_production_per_hour/2.
%#show energy_snapshot/3.
%#show surplus_energy_per_member/3.
#show kpi_1/2.
#show kpi_2/2.