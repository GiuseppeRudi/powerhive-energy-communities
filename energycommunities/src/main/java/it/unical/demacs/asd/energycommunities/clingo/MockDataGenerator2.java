package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.*;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockDataGenerator2 {

    public static User createMockUser() {
        // Creazione dello User
        User user = new User();
        user.setId((long) 1);
        user.setFirstName("Francesco");
        user.setLastName("Cristiano");
        user.setUsername("fcristiano");
        user.setEmail("francesco.cristiano@example.com");
        user.setPassword("securePassword123");

        // Creazione del Plan
        Plan plan = new Plan();
        plan.setId(10L);
        plan.setUser(user);
        user.setPlan(plan);

        List<Member> members = new ArrayList<>();
        long memberId = 1;
        Random random = new Random();
        random.setSeed(69);

        // Member 1 - 3 profili PRODUCER
        Member member1 = new Member();
        member1.setId(memberId++);
        member1.setFullName("Mario Rossi");
        member1.setPlan(plan);

        List<Profile> profiles1 = new ArrayList<>();
        Profile profile = new Profile();
        profile.setId(1L);
        profile.setMember(member1);
        profile.setType(ProfileType.PRODUCER);

        ProfileGraph graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 0, 12)); // Producer: valori più bassi
        profile.setProfileGraph(graph);
        profiles1.add(profile);
        member1.setProfiles(profiles1);
        members.add(member1);

        // Member 2 - 4 profili CONSUMER
        Member member2 = new Member();
        member2.setId(memberId++);
        member2.setFullName("Lucia Bianchi");
        member2.setPlan(plan);

        List<Profile> profiles2 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member2);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 1, 14)); // Consumer: valori più alti
        profile.setProfileGraph(graph);
        profiles2.add(profile);
        member2.setProfiles(profiles2);
        members.add(member2);

        // Member 3 - 5 profili misti (3 PRODUCER, 2 CONSUMER)
        Member member3 = new Member();
        member3.setId(memberId++);
        member3.setFullName("Giovanni Verdi");
        member3.setPlan(plan);

        List<Profile> profiles3 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member3);
        profile.setType(ProfileType.PRODUCER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 1, 15));
        profile.setProfileGraph(graph);
        profiles3.add(profile);

        profile = new Profile();
        profile.setId(2L);
        profile.setMember(member3);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(2L);
        graph.setGraph(generateRandomGraph(random, 1, 15));
        profile.setProfileGraph(graph);
        profiles3.add(profile);
        member3.setProfiles(profiles3);
        members.add(member3);

        // Member 4 - 3 profili tutti CONSUMER
        Member member4 = new Member();
        member4.setId(memberId++);
        member4.setFullName("Anna Ferrari");
        member4.setPlan(plan);

        List<Profile> profiles4 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member4);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 2, 14));
        profile.setProfileGraph(graph);
        profiles4.add(profile);
        member4.setProfiles(profiles4);
        members.add(member4);

        // Member 5 - 4 profili misti (2 PRODUCER, 2 CONSUMER)
        Member member5 = new Member();
        member5.setId(memberId++);
        member5.setFullName("Marco Colombo");
        member5.setPlan(plan);

        List<Profile> profiles5 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member5);
        profile.setType(ProfileType.PRODUCER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 2, 13));
        profile.setProfileGraph(graph);
        profiles5.add(profile);

        profile = new Profile();
        profile.setId(2L);
        profile.setMember(member5);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(2L);
        graph.setGraph(generateRandomGraph(random, 2, 13));
        profile.setProfileGraph(graph);
        profiles5.add(profile);
        member5.setProfiles(profiles5);
        members.add(member5);

        // Member 6 - 5 profili tutti PRODUCER
        Member member6 = new Member();
        member6.setId(memberId++);
        member6.setFullName("Francesca Esposito");
        member6.setPlan(plan);

        List<Profile> profiles6 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member6);
        profile.setType(ProfileType.PRODUCER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 0, 11));
        profile.setProfileGraph(graph);
        profiles6.add(profile);
        member6.setProfiles(profiles6);
        members.add(member6);

        // Member 7 - 3 profili misti (1 PRODUCER, 2 CONSUMER)
        Member member7 = new Member();
        member7.setId(memberId++);
        member7.setFullName("Alessandro Ricci");
        member7.setPlan(plan);

        List<Profile> profiles7 = new ArrayList<>();
        Profile profile7_1 = new Profile();
        profile7_1.setId(1L);
        profile7_1.setMember(member7);
        profile7_1.setType(ProfileType.PRODUCER);
        ProfileGraph graph7_1 = new ProfileGraph();
        graph7_1.setId(1L);
        graph7_1.setGraph(generateRandomGraph(random, 3, 15));
        profile7_1.setProfileGraph(graph7_1);
        profiles7.add(profile7_1);

        profile = new Profile();
        profile.setId(2L);
        profile.setMember(member7);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(2L);
        graph.setGraph(generateRandomGraph(random, 3, 15));
        profile.setProfileGraph(graph);
        profiles7.add(profile);
        member7.setProfiles(profiles7);
        members.add(member7);

        // Member 8 - 4 profili tutti PRODUCER
        Member member8 = new Member();
        member8.setId(memberId++);
        member8.setFullName("Giulia Marino");
        member8.setPlan(plan);

        List<Profile> profiles8 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member8);
        profile.setType(ProfileType.PRODUCER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 0, 12));
        profile.setProfileGraph(graph);
        profiles8.add(profile);
        member8.setProfiles(profiles8);
        members.add(member8);

        // Member 9 - 5 profili misti (4 CONSUMER, 1 PRODUCER)
        Member member9 = new Member();
        member9.setId(memberId++);
        member9.setFullName("Roberto Gallo");
        member9.setPlan(plan);

        List<Profile> profiles9 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member9);
        profile.setType(ProfileType.CONSUMER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 1, 13));
        profile.setProfileGraph(graph);
        profiles9.add(profile);

        Profile profile9_5 = new Profile();
        profile9_5.setId(2L);
        profile9_5.setMember(member9);
        profile9_5.setType(ProfileType.PRODUCER);
        ProfileGraph graph9_5 = new ProfileGraph();
        graph9_5.setId(2L);
        graph9_5.setGraph(generateRandomGraph(random, 1, 13));
        profile9_5.setProfileGraph(graph9_5);
        profiles9.add(profile9_5);

        member9.setProfiles(profiles9);
        members.add(member9);

        // Member 10 - 3 profili misti (2 PRODUCER, 1 CONSUMER)
        Member member10 = new Member();
        member10.setId(memberId);
        member10.setFullName("Elena Romano");
        member10.setPlan(plan);

        List<Profile> profiles10 = new ArrayList<>();
        profile = new Profile();
        profile.setId(1L);
        profile.setMember(member10);
        profile.setType(ProfileType.PRODUCER);
        graph = new ProfileGraph();
        graph.setId(1L);
        graph.setGraph(generateRandomGraph(random, 2, 14));
        profile.setProfileGraph(graph);
        profiles10.add(profile);

        Profile profile10_3 = new Profile();
        profile10_3.setId(2L);
        profile10_3.setMember(member10);
        profile10_3.setType(ProfileType.CONSUMER);
        ProfileGraph graph10_3 = new ProfileGraph();
        graph10_3.setId(2L);
        graph10_3.setGraph(generateRandomGraph(random, 2, 14));
        profile10_3.setProfileGraph(graph10_3);
        profiles10.add(profile10_3);

        member10.setProfiles(profiles10);
        members.add(member10);

        plan.setMembers(members);

        for(Member member : members){
            System.out.println("Member " + member.getId() + " " + member.getMemberType());
            for(Profile p : member.getProfiles()){
                System.out.println("  Profile " + p.getId() + " " + p.getType());
                System.out.println("    ProfileGraph " + p.getProfileGraph().getId() + ": " + p.getProfileGraph().getGraph());
            }
            System.out.println();
        }

        return user;
    }

    private static List<Integer> generateRandomGraph(Random random, int minValue, int maxValue) {
        List<Integer> graph = new ArrayList<>();

        for (int hour = 0; hour < 24; hour++) {
            int value;

            if (hour < 6) {
                // Notte: valori bassi
                value = random.nextInt((maxValue - minValue) / 4) + minValue;
            } else if (hour < 9) {
                // Mattina presto: valori crescenti
                value = random.nextInt((maxValue - minValue) / 2) + minValue + (maxValue - minValue) / 4;
            } else if (hour < 18) {
                // Giorno: valori alti
                value = random.nextInt((maxValue - minValue) / 3) + minValue + (maxValue - minValue) * 2 / 3;
            } else if (hour < 22) {
                // Sera: valori medio-alti
                value = random.nextInt((maxValue - minValue) / 2) + minValue + (maxValue - minValue) / 3;
            } else {
                // Tarda sera: valori decrescenti
                value = random.nextInt((maxValue - minValue) / 3) + minValue;
            }

            graph.add(value);
        }

        return graph;
    }

    public static void main(String[] args) {
        User user = MockDataGenerator2.createMockUser();
        Analysis2 analysis2 = new Analysis2();
        analysis2.generate(user,5);
    }
}


