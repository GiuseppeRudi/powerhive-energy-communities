package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.Profile;
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
            return createBestModelDto(user, bestModel);
        }  else {
            return null;
        }
    }

    private BestModelDto createBestModelDto(User user, String[] bestModel) {
        BestModelDto bestModelDto = new BestModelDto();
        List<MemberDetailDto> memberDtos = new ArrayList<>();
        // List<Integer> kpi1List = new ArrayList<>();
        // List<Integer> kpi2List = new ArrayList<>();

        Pattern assignPattern = Pattern.compile("assign\\((\\d+),(\\d+)\\)");
        // Pattern kpi1Pattern = Pattern.compile("kpi_1\\((\\d+),(\\d+)\\)");
        // Pattern kpi2Pattern = Pattern.compile("kpi_2\\((\\d+),(\\d+)\\)");

        Map<Long, Integer> alreadyAdded = new HashMap<>();
        int count = 0;

        for (String a : bestModel) {
            Matcher assignMatcher = assignPattern.matcher(a);
            // Matcher kpi1Matcher = kpi1Pattern.matcher(atom);
            // Matcher kpi2Matcher = kpi2Pattern.matcher(atom);

            if (assignMatcher.find()) {
                Long memberId = Long.valueOf(assignMatcher.group(1));
                long profileId = Long.parseLong(assignMatcher.group(2));
                MemberDetailDto memberDto;
                if (alreadyAdded.containsKey(memberId)) {
                    memberDto = memberDtos.get(alreadyAdded.get(memberId));
                } else {
                    memberDto = new MemberDetailDto();
                    memberDto.setId(memberId);
                    memberDtos.add(memberDto);
                    alreadyAdded.put(memberId, count++);
                }

                Member member = user.getPlan().getMembers().get((int) (memberId - 1));
                memberDto.setFullName(member.getFullName());
                memberDto.setMemberType(member.getMemberType());

                Profile profile = member.getProfiles().get((int) (profileId - 1));
                ProfileDto profileDto = new ProfileDto();
                profileDto.setId(profileId);
                profileDto.setProfileType(profile.getType());
                profileDto.setGraph(profile.getProfileGraph().getGraph());

                memberDto.getProfiles().add(profileDto);
            }
//            else if (kpi1Matcher.find()) {
//                int percentage = Integer.parseInt(kpi1Matcher.group(2));
//                kpi1List.add(percentage);
//            }
//            else if (kpi2Matcher.find()) {
//                int percentage = Integer.parseInt(kpi2Matcher.group(2));
//                kpi2List.add(percentage);
//            }
        }

        bestModelDto.setAssignments(memberDtos);
        // bestModelDto.setKpi1(kpi1List);
        // bestModelDto.setKpi2(kpi2List);
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
