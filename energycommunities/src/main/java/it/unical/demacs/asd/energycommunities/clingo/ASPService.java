package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.Profile;
import it.unical.demacs.asd.energycommunities.data.entities.ProfileGraph;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.dto.BestModelDto;
import it.unical.demacs.asd.energycommunities.dto.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.potassco.clingo.*;
import org.potassco.clingo.control.Control;
import org.potassco.clingo.solving.Model;
import org.potassco.clingo.solving.SolveHandle;
import org.potassco.clingo.solving.SolveMode;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ASPService {

    public BestModelDto chooseBestProfiles(User user) {
        String facts = ASPFactMapper.toFacts(user);

        String bestModelStr = null;
        long[] bestCost = null;
        String[] bestModel = null;

        try (Control ctl = new Control("0", "--opt-mode=opt")) {

            ctl.load(Path.of("energycommunities/asp/assign_profile.lp"));
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
                bestModel = bestModelStr.split(" ");
            } else {
                System.out.println("Nessun modello trovato.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        if (bestModel != null) {
            return createBestModelDto(user, bestModel,bestCost);
        }  else {
            return null;
        }
    }

    private BestModelDto createBestModelDto(User user, String[] bestModel, long[] bestCost) {
        BestModelDto bestModelDto = new BestModelDto();
        bestModelDto.setCost(bestCost);
//        List<MemberDto> memberDtos = new ArrayList<>();
        List<MemberDetailDto> memberDtos = new ArrayList<>();
        Pattern pattern = Pattern.compile("assign\\((\\d+),(\\d+)\\)");

        Map<Long,Integer> alreadyAdded = new HashMap<>();
        int count = 0;

        for (String assignment : bestModel) {
            System.out.println(assignment);
            Matcher matcher = pattern.matcher(assignment);
            if (!matcher.find()) continue; // usa find(), non matches()
            Long memberId = Long.valueOf(matcher.group(1));
            long profileId = Long.parseLong(matcher.group(2));
//            MemberDto memberDto = new MemberDto();
            MemberDetailDto memberDto = new MemberDetailDto();
            ProfileDto profileDto = new ProfileDto();
            if (matcher.matches()) {
                if (alreadyAdded.containsKey(memberId)) {
                    memberDto = memberDtos.get(alreadyAdded.get(memberId));
                } else {
                    memberDto.setId(memberId);
                }
                profileDto.setId(profileId);
            } else continue;
            Member member = user.getPlan().getMembers().get((int) (memberId-1));
            memberDto.setMemberType(member.getMemberType());
            Profile profile = member.getProfiles().get((int) (profileId-1));
            profileDto.setProfileType(profile.getType());
            ProfileGraph pg = profile.getProfileGraph();
            profileDto.setGraph(pg.getGraph());
            memberDto.getProfiles().add(profileDto);
            if (alreadyAdded.containsKey(memberId)) {
                memberDtos.set(alreadyAdded.get(memberId), memberDto);
            } else {
                memberDtos.add(memberDto);
                alreadyAdded.put(memberId, count++);
            }
        }
        bestModelDto.setAssignments(memberDtos);
        return bestModelDto;
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
