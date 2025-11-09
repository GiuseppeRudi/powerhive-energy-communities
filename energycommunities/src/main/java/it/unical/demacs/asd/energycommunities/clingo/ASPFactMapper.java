package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.*;

public class ASPFactMapper {

    public static String toFactsWithUser(User user) {
        StringBuilder facts = new StringBuilder();

        facts.append(String.format("user(%d, \"%s\", \"%s\").\n",
                user.getId(), user.getFirstName(), user.getLastName()));

        Plan plan = user.getPlan();
        if (plan != null) {
            facts.append(String.format("plan(%d, %d).\n", plan.getId(), user.getId()));

            for (Member member : plan.getMembers()) {
                facts.append(String.format("member(%d, %d, %s).\n",
                        member.getId(), plan.getId(), member.getMemberType().name().toLowerCase()));

                profilesAndGraphsToFacts(facts, member);
            }
        }

        return facts.toString();
    }

    public static String toFacts(User user, int analysis) {
        return toFacts(user, analysis, null); // valore di default, ad esempio 0
    }

    public static String toFacts(User user, int analysis, Integer dim) {
        StringBuilder facts = new StringBuilder();

        for (Member member : user.getPlan().getMembers()) {
            facts.append(String.format("member(%d, %d, %s).\n",
                    member.getId(), user.getPlan().getId(), member.getMemberType().name().toLowerCase()));

            profilesAndGraphsToFacts(facts, member);
        }
        if (analysis == 2) facts.append(String.format("dimCommunity(%d).\n", dim));

        return facts.toString();
    }

    private static void profilesAndGraphsToFacts(StringBuilder facts, Member member) {
        for (Profile profile : member.getProfiles()) {
            facts.append(String.format("profile(%d, %d, %s).\n",
                    profile.getId(), member.getId(), profile.getType().name().toLowerCase()));

            ProfileGraph g = profile.getProfileGraph();
            if (g != null) {
                int pos = 0;
                for (Integer val: g.getGraph()) {
                    facts.append(String.format("profileGraph(%d,%d,%d,%d).\n", member.getId(), profile.getId(), pos, val));
                    pos++;
                }
            }
        }
    }
}

