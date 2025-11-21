package it.unical.demacs.asd.energycommunities.clingo;

import it.unical.demacs.asd.energycommunities.data.utils.MemberType;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockDataGenerator2 {

    public static List<MemberDetailDto> generateListOfMembers() {
      

        List<MemberDetailDto> members = new ArrayList<>();
        long memberId = 1;
        Random random = new Random();
        random.setSeed(69);

        // MemberDetailDto 1 - 3 profili PRODUCER
        MemberDetailDto member1 = new MemberDetailDto();
        member1.setId(memberId++);
        member1.setFullName("Mario Rossi");
        member1.setMemberType(MemberType.PRODUCER);

        List<ProfileDto> profiles1 = new ArrayList<>();
        ProfileDto ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);
        
        ProfileDto.setGraph(generateRandomGraph(random, 0, 12));
        profiles1.add(ProfileDto);
        member1.setProfiles(profiles1);
        members.add(member1);

        // MemberDetailDto 2 - 4 profili CONSUMER
        MemberDetailDto member2 = new MemberDetailDto();
        member2.setId(memberId++);
        member2.setFullName("Lucia Bianchi");
        member2.setMemberType(MemberType.CONSUMER);

        List<ProfileDto> profiles2 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);

        ProfileDto.setGraph(generateRandomGraph(random, 1, 14));
        profiles2.add(ProfileDto);
        member2.setProfiles(profiles2);
        members.add(member2);

        // MemberDetailDto 3 - 5 profili misti (3 PRODUCER, 2 CONSUMER)
        MemberDetailDto member3 = new MemberDetailDto();
        member3.setId(memberId++);
        member3.setFullName("Giovanni Verdi");
        member3.setMemberType(MemberType.PROSUMER);


        List<ProfileDto> profiles3 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);

        ProfileDto.setGraph(generateRandomGraph(random, 1, 15));
        profiles3.add(ProfileDto);

        ProfileDto = new ProfileDto();
        ProfileDto.setId(2L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);
        ProfileDto.setGraph(generateRandomGraph(random, 1, 15));
        profiles3.add(ProfileDto);
        member3.setProfiles(profiles3);
        members.add(member3);

        // MemberDetailDto 4 - 3 profili tutti CONSUMER
        MemberDetailDto member4 = new MemberDetailDto();
        member4.setId(memberId++);
        member4.setFullName("Anna Ferrari");
        member4.setMemberType(MemberType.CONSUMER);


        List<ProfileDto> profiles4 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);
        ProfileDto.setGraph(generateRandomGraph(random, 2, 14));
        profiles4.add(ProfileDto);
        member4.setProfiles(profiles4);
        members.add(member4);

        // MemberDetailDto 5 - 4 profili misti (2 PRODUCER, 2 CONSUMER)
        MemberDetailDto member5 = new MemberDetailDto();
        member5.setId(memberId++);
        member5.setFullName("Marco Colombo");
        member5.setMemberType(MemberType.PROSUMER);

        List<ProfileDto> profiles5 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);

        ProfileDto.setGraph(generateRandomGraph(random, 2, 13));
        profiles5.add(ProfileDto);

        ProfileDto = new ProfileDto();
        ProfileDto.setId(2L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);

        ProfileDto.setGraph(generateRandomGraph(random, 2, 13));
        profiles5.add(ProfileDto);
        member5.setProfiles(profiles5);
        members.add(member5);

        // MemberDetailDto 6 - 5 profili tutti PRODUCER
        MemberDetailDto member6 = new MemberDetailDto();
        member6.setId(memberId++);
        member6.setFullName("Francesca Esposito");
        member6.setMemberType(MemberType.PRODUCER);

        List<ProfileDto> profiles6 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);

        ProfileDto.setGraph(generateRandomGraph(random, 0, 11));
        profiles6.add(ProfileDto);
        member6.setProfiles(profiles6);
        members.add(member6);

        // MemberDetailDto 7 - 3 profili misti (1 PRODUCER, 2 CONSUMER)
        MemberDetailDto member7 = new MemberDetailDto();
        member7.setId(memberId++);
        member7.setFullName("Alessandro Ricci");
        member7.setMemberType(MemberType.PROSUMER);

        List<ProfileDto> profiles7 = new ArrayList<>();
        ProfileDto profile7_1 = new ProfileDto();
        profile7_1.setId(1L);
        profile7_1.setProfileType(ProfileType.PRODUCER);


        profile7_1.setGraph(generateRandomGraph(random, 3, 15));
        profiles7.add(profile7_1);

        ProfileDto = new ProfileDto();
        ProfileDto.setId(2L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);

        ProfileDto.setGraph(generateRandomGraph(random, 3, 15));
        profiles7.add(ProfileDto);
        member7.setProfiles(profiles7);
        members.add(member7);

        // MemberDetailDto 8 - 4 profili tutti PRODUCER
        MemberDetailDto member8 = new MemberDetailDto();
        member8.setId(memberId++);
        member8.setFullName("Giulia Marino");
        member8.setMemberType(MemberType.PRODUCER);

        List<ProfileDto> profiles8 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);

        ProfileDto.setGraph(generateRandomGraph(random, 0, 12));
        profiles8.add(ProfileDto);
        member8.setProfiles(profiles8);
        members.add(member8);

        // MemberDetailDto 9 - 5 profili misti (4 CONSUMER, 1 PRODUCER)
        MemberDetailDto member9 = new MemberDetailDto();
        member9.setId(memberId++);
        member9.setFullName("Roberto Gallo");
        member9.setMemberType(MemberType.PROSUMER);

        List<ProfileDto> profiles9 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.CONSUMER);

        ProfileDto.setGraph(generateRandomGraph(random, 1, 13));
        profiles9.add(ProfileDto);

        ProfileDto profile9_5 = new ProfileDto();
        profile9_5.setId(2L);
        profile9_5.setProfileType(ProfileType.PRODUCER);

        profile9_5.setGraph(generateRandomGraph(random, 1, 13));
        profiles9.add(profile9_5);

        member9.setProfiles(profiles9);
        members.add(member9);

        // MemberDetailDto 10 - 3 profili misti (2 PRODUCER, 1 CONSUMER)
        MemberDetailDto member10 = new MemberDetailDto();
        member10.setId(memberId);
        member10.setFullName("Elena Romano");
        member10.setMemberType(MemberType.PROSUMER);

        List<ProfileDto> profiles10 = new ArrayList<>();
        ProfileDto = new ProfileDto();
        ProfileDto.setId(1L);
        ProfileDto.setProfileType(ProfileType.PRODUCER);

        ProfileDto.setGraph(generateRandomGraph(random, 2, 14));
        profiles10.add(ProfileDto);

        ProfileDto profile10_3 = new ProfileDto();
        profile10_3.setId(2L);
        profile10_3.setProfileType(ProfileType.CONSUMER);

        profile10_3.setGraph(generateRandomGraph(random, 2, 14));
        profiles10.add(profile10_3);

        member10.setProfiles(profiles10);
        members.add(member10);


        for(MemberDetailDto MemberDetailDto : members){
            System.out.println("MemberDetailDto " + MemberDetailDto.getId() );
            for(ProfileDto p : MemberDetailDto.getProfiles()){
                System.out.println("  ProfileDto " + p.getId() + " " + p.getProfileType());
                System.out.println("    ProfileGraph " + p.getId() + ": " + p.getGraph());
            }
            System.out.println();
        }

        return members;
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
        List<MemberDetailDto> members = MockDataGenerator2.generateListOfMembers();


        ASPService aspService = new ASPService();
        List<Long> wantToAdd = new ArrayList<>();
        List<Long> wantToRemove = new ArrayList<>();
        aspService.generateOptimalCommunity(members, wantToAdd, wantToRemove);
    }
}


