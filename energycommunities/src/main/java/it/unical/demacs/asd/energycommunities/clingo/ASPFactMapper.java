package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.*;
import java.util.stream.Collectors;

public class ASPFactMapper {

    public static String toFacts(User user) {
        StringBuilder facts = new StringBuilder();

        // User
        facts.append(String.format("user(%d, \"%s\", \"%s\").\n",
                user.getId(), user.getFirstName(), user.getLastName()));

        // Plan
        Plan plan = user.getPlan();
        if (plan != null) {
            facts.append(String.format("plan(%d, %d).\n", plan.getId(), user.getId()));

            // Members
            for (Member member : plan.getMembers()) {
                facts.append(String.format("member(%d, %d, %s).\n",
                        member.getId(), plan.getId(), member.getMemberType().name().toLowerCase()));

                // Profiles
                for (Profile profile : member.getProfiles()) {
                    facts.append(String.format("profile(%d, %d, %s).\n",
                            profile.getId(), member.getId(), profile.getType().name().toLowerCase()));

                    // Profile Graph
                    ProfileGraph g = profile.getProfileGraph();
                    if (g != null) {
                        String values = g.getGraph().stream()
                                .map(Object::toString)
                                .collect(Collectors.joining(","));
                        //facts.append(String.format("profileGraph(%d, [%s]).\n", g.getId(), values));
                    }
                }
            }
        }

        return facts.toString();
    }
}

