package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.User;
import org.potassco.clingo.*;
import org.potassco.clingo.control.Control;
import org.potassco.clingo.solving.Model;
import org.potassco.clingo.solving.SolveHandle;
import org.potassco.clingo.solving.SolveMode;
import org.potassco.clingo.symbol.Signature;

import java.io.IOException;
import java.util.Arrays;

public class ASPService {

    public void runClingo(User user) {
        String facts = ASPFactMapper.toFacts(user);

        String rules = """
            total_energy(U, Total) :- 
                user(U,_,_),
                profile(P,_,_),
                profileGraph(_,Values),
                Total = #sum{E : member(_,_,_), E=1}.
            """;

        String program = facts + "\n" + rules;
        Control ctl = new Control("0");



//            ctl.load("src/main/resources/asp/energy.lp");
//            ctl.add("base", new Signature[0], facts);
        ctl.add(program);
        ctl.ground();

        try (SolveHandle handle = ctl.solve(SolveMode.YIELD)) {
            while (handle.hasNext()) {
                Model model = handle.next();
                System.out.println(model);
            }
        }

        ctl.close();
    }
}
