% user(UserId,FirstName,LastName)
% plan(PlanId,UserId)
% member(MemberId,PlanId,MemberType)
% profile(ProfileId,MemberId,PGId,ProfileType)
% profileGraph(PGId,Hour,Value)


consumer(P,M) :- profile(P,M,_,consumer).
producer(P,M) :- profile(P,M,_,producer).
time(T) :- profileGraph(_,T,_).

% ---------------- Assegnazione profili ----------------
{ assign(P,M) : consumer(P,M) } <= 1 :- member(M,_,_).
{ assign(P,M) : producer(P,M) } <= 1 :- member(M,_,_).
:- #count{P: assign(P,M)}!=1, member(M,_,_).

consumers_consumption_per_hour(T,V) :-
    time(T),
    V = #sum{Value,P: assign(P,M), profile(P,M,I,consumer), profileGraph(I,T,Value)}.

producers_production_per_hour(T,V) :-
    time(T),
    V = #sum{Value,P: assign(P,M), profile(P,M,I,producer), profileGraph(I,T,Value)}.

energy_snapshot(T,A,B-A) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A <= B.
energy_snapshot(T,B,A-B) :- consumers_consumption_per_hour(T,A), producers_production_per_hour(T,B), A > B.

max_gap(K) :- K = #max{0; Z : energy_snapshot(_,_,Z)}.

% vincoli deboli per minimizzare gap
:~ max_gap(K). [K@1]
:~ energy_snapshot(T,_,K). [K@2,T]

#show assign/2.
#show consumers_consumption_per_hour/2.
#show producers_production_per_hour/2.
#show energy_snapshot/3.
#show kpi_1(T,@ratio(A,B)): energy_snapshot(T,A,_), producers_production_per_hour(T,B).
#show kpi_2(T,@ratio(A,B)): energy_snapshot(T,A,_), consumers_consumption_per_hour(T,B).

