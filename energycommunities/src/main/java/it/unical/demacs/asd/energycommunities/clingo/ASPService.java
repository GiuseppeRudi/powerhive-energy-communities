package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.User;
import org.potassco.clingo.*;
import org.potassco.clingo.control.Control;
import org.potassco.clingo.solving.Model;
import org.potassco.clingo.solving.SolveHandle;
import org.potassco.clingo.solving.SolveMode;
import org.potassco.clingo.symbol.Signature;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;

public class ASPService {

    public void runClingo(User user) {
        String facts = ASPFactMapper.toFacts(user);

        Control ctl = new Control("0");

        ctl.load(Path.of("energycommunities/asp/assign_profile.lp"));
        ctl.add(facts);
        ctl.ground();

        try (SolveHandle handle = ctl.solve(SolveMode.YIELD)) {
            for(int j=0; j<2; j++) {
                //while (handle.hasNext()) {
                Model model = handle.next();
                System.out.println(model);
                long[] cost = model.getCost();
                System.out.print("Weight@Priority: ");
                for (int i = 0; i < cost.length; i++) {
                    System.out.print(cost[i] + "@" + (cost.length - i) + " ");
                }
                System.out.println();
            }
            //}
        }

        ctl.close();
    }
}
