package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.Profile;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_1Dto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
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

    public ResultAnalysis_1Dto chooseBestProfiles(User user) {
        String facts = ASPFactMapper.toFacts(user,1);
        String bestModelStr = null;
        long[] bestCost = null;
        String[] bestModel = null;

        try (Control ctl = new Control("0", "--opt-mode=opt")) {

            ctl.load(Path.of("energycommunities/encodings/analysis1.lp"));
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

    private ResultAnalysis_1Dto createBestModelDto(User user, String[] bestModel) {
        ResultAnalysis_1Dto resultAnalysis1Dto = new ResultAnalysis_1Dto();
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

                Member member = user.getPlan().getMembers()
                        .stream()
                        .filter(m -> Objects.equals(m.getId(), memberId))
                        .findFirst()
                        .orElse(null);

                if (member == null) {
                    System.err.println("Member ID " + memberId + " not found in user's plan");
                    continue; // salta questo ciclo, evita crash
                }

                memberDto.setFullName(member.getFullName());
                memberDto.setMemberType(member.getMemberType());

                Profile profile = member.getProfiles()
                        .stream()
                        .filter(p -> Objects.equals(p.getId(), profileId))
                        .findFirst()
                        .orElse(null);

                if (profile == null) {
                    System.err.println("⚠️ Profile ID " + profileId + " not found for member " + memberId);
                    continue;
                }

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

        resultAnalysis1Dto.setAssignments(memberDtos);
        List<Double> totalProduction = calculateTotal(memberDtos, ProfileType.PRODUCER);
        List<Double> totalConsumption = calculateTotal(memberDtos, ProfileType.CONSUMER);

        resultAnalysis1Dto.setKpi1(calculateKpi(totalConsumption, totalProduction));
        resultAnalysis1Dto.setKpi2(calculateKpi(totalProduction, totalConsumption));

        resultAnalysis1Dto.setTotalProduction(totalProduction);
        resultAnalysis1Dto.setTotalConsumption(totalConsumption);

        // resultAnalysis1Dto.setKpi1(kpi1List);
        // resultAnalysis1Dto.setKpi2(kpi2List);
        return resultAnalysis1Dto;
    }


    private List<Double> calculateTotal(List<MemberDetailDto> members, ProfileType type) {
        List<Double> totals = new ArrayList<>(Collections.nCopies(24, 0.0));
        for (MemberDetailDto m : members) {
            for (ProfileDto p : m.getProfiles()) {
                if (p.getProfileType().equals(type)) {
                    for (int i = 0; i < p.getGraph().size(); i++) {
                        totals.set(i, totals.get(i) + p.getGraph().get(i));
                    }
                }
            }
        }
        return totals;
    }

    private List<Double> calculateKpi(List<Double> a, List<Double> b) {
        List<Double> kpi = new ArrayList<>();
        for (int i = 0; i < a.size(); i++) {
            double value = b.get(i) == 0 ? 0 : (a.get(i) * 100.0 / b.get(i));
            if (value > 100) value = 100;
            kpi.add(Math.round(value * 10.0) / 10.0);
        }
        return kpi;
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
