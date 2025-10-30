package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.entities.*;

import java.io.IOException;
import java.util.List;

public class MockDataGenerator {

    public static User createMockUser() {
        // Creazione dello User
        User user = new User();
        user.setId(1L);
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

        // Creazione di Member 1 - solo Producer
        Member member1 = new Member();
        member1.setId(100L);
        member1.setFullName("Mario Rossi");
        member1.setPlan(plan);

        Profile producerProfile = new Profile();
        producerProfile.setId(1000L);
        producerProfile.setMember(member1);
        producerProfile.setType(Profile.ProfileType.PRODUCER);

        ProfileGraph producerGraph = new ProfileGraph();
        producerGraph.setId(10000L);
        producerGraph.setGraph(List.of(3, 5, 2, 4, 6, 8, 9, 7, 5, 4, 3, 2, 1, 0, 0, 2, 3, 4, 6, 5, 3, 2, 1, 0));
        producerProfile.setProfileGraph(producerGraph);

        member1.setProfiles(List.of(producerProfile));

        // Creazione di Member 2 - Consumer
        Member member2 = new Member();
        member2.setId(101L);
        member2.setFullName("Lucia Bianchi");
        member2.setPlan(plan);

        Profile consumerProfile = new Profile();
        consumerProfile.setId(1001L);
        consumerProfile.setMember(member2);
        consumerProfile.setType(Profile.ProfileType.CONSUMER);

        ProfileGraph consumerGraph = new ProfileGraph();
        consumerGraph.setId(10001L);
        consumerGraph.setGraph(List.of(2, 2, 2, 3, 4, 6, 8, 10, 11, 9, 7, 6, 5, 4, 4, 5, 6, 8, 7, 6, 5, 4, 3, 2));
        consumerProfile.setProfileGraph(consumerGraph);

        member2.setProfiles(List.of(consumerProfile));

        // Associa i membri al piano
        plan.setMembers(List.of(member1, member2));

        return user;
    }

    public static void main(String[] args) {
        User mockUser = createMockUser();
        ASPService aspService = new ASPService();
        aspService.runClingo(mockUser);
    }
}

