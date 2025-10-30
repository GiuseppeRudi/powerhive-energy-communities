package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.naming.NameNotFoundException;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import it.unical.demacs.asd.energycommunities.data.dao.PlanDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.*;
import it.unical.demacs.asd.energycommunities.data.services.PlanService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanDao planDao;
    private final UserDao userDao;

    @Override
    @Transactional
    public void upload(MultipartFile file, Long ownerId) throws NameNotFoundException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is empty");
        }

        if (ownerId == null) {
            throw new IllegalArgumentException("ownerId cannot be null");
        }

        // Retrieve owner user
        User owner = userDao.findById(ownerId)
                .orElseThrow(() -> new NameNotFoundException("User not found with id: " + ownerId));

        BufferedReader reader;
        try {
            reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        } catch (Exception ex) {
            throw new RuntimeException("Unable to read CSV file", ex);
        }

        @SuppressWarnings("deprecation")
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreHeaderCase(true)
                .setTrim(true)
                .build();

        Iterable<CSVRecord> records;
        try {
            records = csvFormat.parse(reader);
        } catch (Exception ex) {
            throw new RuntimeException("CSV parsing error", ex);
        }

        // Create new Plan
        Plan plan = new Plan();
        List<Member> members = new ArrayList<>();

        for (CSVRecord record : records) {

            Member member = new Member();
            member.setFullName(record.get("nome_cognome"));
            member.setEmail(record.get("email"));
            member.setPlan(plan); // connect to plan

            // Determine MemberType
            String category = record.get("category").toLowerCase();
            Member.MemberType memberType = switch (category) {
                case "producer" -> Member.MemberType.PRODUCER;
                case "consumer" -> Member.MemberType.CONSUMER;
                default -> Member.MemberType.PROSUMER;
            };
            member.setMemberType(memberType);

            // Create Profile
            Profile profile = new Profile();
            profile.setMember(member);
            profile.setType(
                    (memberType == Member.MemberType.PRODUCER)
                            ? Profile.ProfileType.PRODUCER
                            : Profile.ProfileType.CONSUMER
            );

            // Create ProfileGraph and fill values
            ProfileGraph graph = new ProfileGraph();
            for (int i = 0; i < 24; i++) {
                String column = "t" + i;
                Integer value = Integer.parseInt(record.get(column));
                graph.getGraph().add(value);
            }

            profile.setProfileGraph(graph);

            List<Profile> profiles = new ArrayList<>();
            profiles.add(profile);
            member.setProfiles(profiles);

            members.add(member);
        }

        // connect members to plan
        plan.setMembers(members);

        // Save plan (cascades save members, profiles, graph)
        planDao.save(plan);

        // Assign plan to owner and save user
        owner.setPlan(plan);
        userDao.save(owner);
    }
}
