total_energy(U, M, P, Total) :-
                user(U,_,_),
                plan(PL,U),
                member(M,PL,_),
                profile(P,M,PG,_),
                Total = #sum{V,H: profileGraph(PG,H,V)}.