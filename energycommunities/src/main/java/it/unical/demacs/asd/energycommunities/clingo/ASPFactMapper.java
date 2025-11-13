package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.*;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;

import java.util.List;

public class ASPFactMapper {

    public static String toFacts1(List<MemberDetailDto> members, int analysis) {
        return toFacts2(members, analysis, null); // valore di default, ad esempio 0
    }

    public static String toFacts3(List<MemberDetailDto> members, List<Long> wantToAdd, List<Long> wantToRemove) {
        StringBuilder facts = new StringBuilder();

        for (MemberDetailDto member : members) {
            if (wantToAdd.contains(member.getId())) facts.append(String.format("wantToAdd(%d).\n", member.getId()));
            else if (wantToRemove.contains(member.getId())) facts.append(String.format("wantToRemove(%d).\n", member.getId()));
            facts.append(String.format("member(%d, %d, %s).\n",
                    member.getId(), 0, member.getMemberType().name().toLowerCase()));

            profilesAndGraphsToFacts(facts, member);
        }
        return facts.toString();
    }

    public static String toFacts2(List<MemberDetailDto> members, int analysis, Integer dim) {
        StringBuilder facts = new StringBuilder();

        for (MemberDetailDto  member :members) {
            facts.append(String.format("member(%d, %d, %s).\n",
                    member.getId(), 0 , member.getMemberType().name().toLowerCase()));
            profilesAndGraphsToFacts(facts, member);
        }
        if (analysis == 2) facts.append(String.format("dimCommunity(%d).\n", dim));

        return facts.toString();
    }

    private static void profilesAndGraphsToFacts(StringBuilder facts, MemberDetailDto member) {
        for (ProfileDto profile : member.getProfiles()) {
            facts.append(String.format("profile(%d, %d, %s).\n",
                    profile.getId(), member.getId(), profile.getProfileType().name().toLowerCase()));


            int pos = 0;
            for (Integer val: profile.getGraph()) {
                facts.append(String.format("profileGraph(%d,%d,%d,%d).\n", member.getId(), profile.getId(), pos, val));
                pos++;
            }

        }
    }
}

