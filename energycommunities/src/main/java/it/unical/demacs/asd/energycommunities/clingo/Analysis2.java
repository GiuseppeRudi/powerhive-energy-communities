package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.User;
import org.potassco.clingo.control.Control;
import org.potassco.clingo.solving.Model;
import org.potassco.clingo.solving.SolveHandle;
import org.potassco.clingo.solving.SolveMode;

import java.nio.file.Path;

public class Analysis2 {
    public void generate(User user, int dim){
        String facts = ASPFactMapper.toFacts(user,2,dim);

        String bestModelStr = null;
        long[] bestCost = null;

        try (Control ctl = new Control("0", "--opt-mode=opt")) {

            ctl.load(Path.of("energycommunities/encodings/analysis2.lp"));
            ctl.add(facts);
            ctl.ground();

            try (SolveHandle handle = ctl.solve(SolveMode.YIELD)) {
                while (handle.hasNext()) {
                    Model model = handle.next();
                    System.out.println(model);
                    long[] cost = model.getCost();

                    for (int i = 0; i < cost.length; i++) {
                        System.out.print(cost[i] + "@" + (cost.length - i) + " ");
                    }
                    System.out.println();

                    if (bestCost == null || isBetter(cost, bestCost)) {
                        // clone dei costi perché l'array potrebbe essere riutilizzato internamente
                        bestCost = cost.clone();
                        bestModelStr = model.toString();
                    }
                }
            }

            if (bestModelStr != null) {
                System.out.println("=== Modello ottimale ===");
                System.out.println(bestModelStr);
                System.out.print("Costo (Weight@Priority): ");
                for (int i = 0; i < bestCost.length; i++) {
                    System.out.print(bestCost[i] + "@" + (bestCost.length - i) + " ");
                }
                System.out.println();
            } else {
                System.out.println("Nessun modello trovato.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static boolean isBetter(long[] a, long[] b) {
        int n = Math.min(a.length, b.length);
        for (int i = 0; i < n; i++) {
            if (a[i] < b[i]) return true;
            if (a[i] > b[i]) return false;
        }
        return a.length < b.length;
    }
}
