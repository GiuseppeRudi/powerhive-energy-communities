package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.controller.ClingoStreamController;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis1Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis2Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis3Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.SingleAnalysis;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.potassco.clingo.control.Control;
import org.potassco.clingo.solving.Model;
import org.potassco.clingo.solving.SolveHandle;
import org.potassco.clingo.solving.SolveMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ASPService {

    @Autowired
    private ClingoStreamController streamController;

    public ResultAnalysis1Dto chooseBestProfiles(List<MemberDetailDto> members) {
        int analysis = 1;
        String facts = ASPFactMapper.toFacts1(members,analysis);
        String[] bestModel = calculateBestModel(facts,analysis);

        if (bestModel != null) {
            return createBestModel1Dto(members, bestModel);
        }  else {
            return null;
        }
    }

    public ResultAnalysis2Dto generateOptimalCommunityDim(List<MemberDetailDto> members, int dim){
        int analysis = 2;
        String facts = ASPFactMapper.toFacts2(members,analysis,dim);

        String[] bestModel = calculateBestModel(facts,analysis);

        if (bestModel != null) {
            return createBestModel2Dto(members, bestModel);
        }  else {
            return null;
        }
    }

    public ResultAnalysis3Dto generateOptimalCommunity(List<MemberDetailDto> members , List<Long> wantToAdd, List<Long> wantToRemove){
        int analysis = 3;
        String facts = ASPFactMapper.toFacts3(members,wantToAdd,wantToRemove);

        String[] bestModel = calculateBestModel(facts,analysis);
        ResultAnalysis3Dto resultAnalysis3Dto = new ResultAnalysis3Dto();

        SingleAnalysis optimalCommunity = createBestModel3Dto(members,bestModel);
        SingleAnalysis defaultComunity = createCommunity(members,wantToAdd);
        SingleAnalysis wantedCommunity = createCommunity(members,wantToRemove);

        resultAnalysis3Dto.setOptimalCommunity(optimalCommunity);
        resultAnalysis3Dto.setWantedCommunity(wantedCommunity);
        resultAnalysis3Dto.setDefaultCommunity(defaultComunity);

        return resultAnalysis3Dto;
    }

    private SingleAnalysis createBestModel3Dto(List<MemberDetailDto> members, String[] bestModel) {
        SingleAnalysis optimalCommunity = new SingleAnalysis();
        List<MemberDetailDto> memberDtos = new ArrayList<>();

        Pattern assignPattern = Pattern.compile("assign\\((\\d+)\\)");

        for (String a : bestModel) {
            Matcher assignMatcher = assignPattern.matcher(a);

            if (assignMatcher.find()) {
                long memberId = Long.parseLong(assignMatcher.group(1));

                MemberDetailDto memberDto = members.stream()
                        .filter(m -> m.getId() == (memberId))
                        .findFirst()
                        .orElse(null);

                memberDtos.add(memberDto);
            }
        }

        optimalCommunity.setAssignments(memberDtos);
        List<Double> totalProduction = calculateTotal(memberDtos, ProfileType.PRODUCER);
        List<Double> totalConsumption = calculateTotal(memberDtos, ProfileType.CONSUMER);

        optimalCommunity.setKpi1(calculateKpi(totalConsumption, totalProduction));
        optimalCommunity.setKpi2(calculateKpi(totalProduction, totalConsumption));

        optimalCommunity.setTotalProduction(totalProduction);
        optimalCommunity.setTotalConsumption(totalConsumption);


        return optimalCommunity;
    }

    private SingleAnalysis createCommunity(List<MemberDetailDto> members , List<Long> wantToAR) {
        SingleAnalysis community = new SingleAnalysis();
        List<MemberDetailDto> memberDtos = new ArrayList<>();

        for (MemberDetailDto member : members) {
            if(wantToAR.contains(member.getId())) continue;
            long memberId = member.getId();

            MemberDetailDto memberDto = members.stream()
                    .filter(m -> m.getId() == (memberId))
                    .findFirst()
                    .orElse(null);


            memberDtos.add(memberDto);
        }

        community.setAssignments(memberDtos);
        List<Double> totalProduction = calculateTotal(memberDtos, ProfileType.PRODUCER);
        List<Double> totalConsumption = calculateTotal(memberDtos, ProfileType.CONSUMER);

        community.setKpi1(calculateKpi(totalConsumption, totalProduction));
        community.setKpi2(calculateKpi(totalProduction, totalConsumption));

        community.setTotalProduction(totalProduction);
        community.setTotalConsumption(totalConsumption);
        return community;
    }

    private String[] calculateBestModel(String facts, int analysis) {
        String bestModelStr = null;
        long[] bestCost = null;
        String[] bestModel = null;

        System.out.println("Starting...");

        try (Control ctl = new Control("0", "--opt-mode=opt")) {
            long startClingo = System.currentTimeMillis();
            // ctl.getConfiguration().get("solve").set("solve_limit", "900");
            if (analysis == 1) {
                ctl.load(Path.of("energycommunities/encodings/analysis1.lp"));
            } else if (analysis == 2) {
                ctl.load(Path.of("energycommunities/encodings/analysis2.lp"));
            } else {
                ctl.load(Path.of("energycommunities/encodings/analysis3.lp"));
            }
            ctl.add(facts);
            streamController.sendEvent("GROUNDING_STARTED");
            System.out.println("Grounding...");
            AtomicBoolean groundingCompleted = new AtomicBoolean(false);
            Thread groundingMonitor = groundingChecker(groundingCompleted);
            groundingMonitor.start();
            ctl.ground();
            groundingCompleted.set(true);
            groundingMonitor.interrupt();
            streamController.sendEvent("GROUNDING_FINISHED");
            System.out.println("Solving...");

            long startSolver = System.currentTimeMillis();

            try (SolveHandle handle = ctl.solve(SolveMode.YIELD)) {
                while (handle.hasNext()) {
                    Model model = handle.next();
                    System.out.println(model);
                    long[] cost = model.getCost();

                    for (int i = 0; i < cost.length; i++) {
                        System.out.print(cost[i] + "@" + (cost.length - i) + " ");
                    }
                    System.out.println();
                    double elapsedTime = (double) (System.currentTimeMillis() - startSolver) / 1000;
                    System.out.println("Time: " + elapsedTime + " seconds.");

                    if (bestCost == null || isBetter(cost, bestCost)) {
                        bestCost = cost.clone();
                        bestModelStr = model.toString();
                    }
                }
            }

            int numMembers = 0;
            Pattern assignPattern = Pattern.compile("member\\(\\d+,[a-zA-Z_]+\\)\\.");
            for(String str: facts.split("\n")) {
                Matcher assignMatcher = assignPattern.matcher(str);
                if (assignMatcher.find()) {
                    numMembers++;
                }
            }

            double elapsedTimeSolver = (double) (System.currentTimeMillis() - startSolver) / 1000;
            double elapsedTimeClingo = (double) (System.currentTimeMillis() - startClingo) / 1000;
            // Decommentare questa linea per salvare i tempi di esecuzione del solver
            // updateCSV(analysis,numMembers, elapsedTimeSolver);

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

            System.out.println("Elapsed time solver: " + elapsedTimeSolver + " seconds.");
            System.out.println("Elapsed time Clingo: " + elapsedTimeClingo + " seconds.");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return bestModel;
    }

    private Thread groundingChecker(AtomicBoolean groundingCompleted) {
        return new Thread(() -> {
            try {
                Thread.sleep(20000);

                if (!groundingCompleted.get()) {
                    streamController.sendEvent("GROUNDING_STILL_RUNNING");
                    System.out.println("Grounding still running...");
                }

            } catch (InterruptedException ignored) {}
        });
    }

    private ResultAnalysis1Dto createBestModel1Dto(List<MemberDetailDto> members, String[] bestModel) {
        ResultAnalysis1Dto resultAnalysis1Dto = new ResultAnalysis1Dto();
        List<MemberDetailDto> memberDtos = new ArrayList<>();

        Pattern assignPattern = Pattern.compile("assign\\((\\d+),(\\d+)\\)");

        Map<Long, Integer> alreadyAdded = new HashMap<>();
        int count = 0;

        for (String a : bestModel) {
            Matcher assignMatcher = assignPattern.matcher(a);

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


                MemberDetailDto member = members.stream()
                        .filter(p -> p.getId().equals(memberId))
                        .findFirst()
                        .orElse(null);

                memberDto.setFullName(member.getFullName());
                memberDto.setMemberType(member.getMemberType());

                ProfileDto profile = member.getProfiles().stream()
                        .filter(p -> p.getId().equals(profileId))
                        .findFirst()
                        .orElse(null);

                memberDto.getProfiles().add(profile);
            }
        }

        resultAnalysis1Dto.setAssignments(memberDtos);
        List<Double> totalProduction = calculateTotal(memberDtos, ProfileType.PRODUCER);
        List<Double> totalConsumption = calculateTotal(memberDtos, ProfileType.CONSUMER);

        resultAnalysis1Dto.setKpi1(calculateKpi(totalConsumption, totalProduction));
        resultAnalysis1Dto.setKpi2(calculateKpi(totalProduction, totalConsumption));

        resultAnalysis1Dto.setTotalProduction(totalProduction);
        resultAnalysis1Dto.setTotalConsumption(totalConsumption);
        return resultAnalysis1Dto;
    }

    private ResultAnalysis2Dto createBestModel2Dto(List<MemberDetailDto> members , String[] bestModel) {
        ResultAnalysis2Dto resultAnalysis2Dto = new ResultAnalysis2Dto();
        List<MemberDetailDto> memberDtos = new ArrayList<>();

        Pattern assignPattern = Pattern.compile("assign\\((\\d+)\\)");

        for (String a : bestModel) {
            Matcher assignMatcher = assignPattern.matcher(a);

            if (assignMatcher.find()) {
                long memberId = Long.parseLong(assignMatcher.group(1));

                MemberDetailDto memberDto = members.stream().filter(m -> m.getId().equals(memberId)).findFirst().orElse(null);

                memberDtos.add(memberDto);

            }
        }

        resultAnalysis2Dto.setAssignments(memberDtos);
        List<Double> totalProduction = calculateTotal(memberDtos, ProfileType.PRODUCER);
        List<Double> totalConsumption = calculateTotal(memberDtos, ProfileType.CONSUMER);

        resultAnalysis2Dto.setKpi1(calculateKpi(totalConsumption, totalProduction));
        resultAnalysis2Dto.setKpi2(calculateKpi(totalProduction, totalConsumption));

        resultAnalysis2Dto.setTotalProduction(totalProduction);
        resultAnalysis2Dto.setTotalConsumption(totalConsumption);
        return resultAnalysis2Dto;
    }

    private static void updateCSV(int analysis, int numFacts, double time) throws IOException {
        Path path = Paths.get("energycommunities/elapsed" + analysis + ".csv");
        if (!Files.exists(path)) {
            try (FileWriter fw = new FileWriter("energycommunities/elapsed" + analysis + ".csv")) {
                fw.write("NUM_FACTS;ELAPSED_TIME\n");
                fw.write(numFacts + ";" + time + ";\n");
                return;
            }
        }

        List<String> lines = Files.readAllLines(path);
        boolean found = false;

        for (int i = 0; i < lines.size(); i++) {
            String row = lines.get(i);

            if (i == 0) continue;

            if (row.startsWith(numFacts + ";")) {
                lines.set(i, row + time + ";");
                found = true;
                break;
            }
        }

        if (!found) {
            lines.add(numFacts + ";" + time + ";");
        }

        Files.write(path, lines);
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
