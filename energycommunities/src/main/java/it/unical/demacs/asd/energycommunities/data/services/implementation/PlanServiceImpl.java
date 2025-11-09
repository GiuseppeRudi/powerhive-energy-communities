package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.data.dao.*;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.dto.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.PlanDto;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import it.unical.demacs.asd.energycommunities.data.entities.*;
import it.unical.demacs.asd.energycommunities.data.services.PlanService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanDao planDao;
    private final UserDao userDao;
    private final MemberDao memberDao;

    @SuppressWarnings("unused")
    private final ProfileDao profileDao;
    
    @SuppressWarnings("unused")
    private final ProfileGraphDao profileGraphDao;

    private final ModelMapper modelMapper;


    @Override
    @Transactional
    public PlanDto upload(MultipartFile file, Long ownerId) throws NameNotFoundException {

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

        /* Retrieve the plan (or create a new one) */
        Plan ownerPlan = planDao.findByUser(owner).orElseGet(() -> {
            Plan p = new Plan();
            p.setMembers(new ArrayList<>());
            p.setUser(owner);

            return p;
        });

        /* Populate plan rows */
        for (CSVRecord record: records){
            Member member = ownerPlan.getMembers().stream().filter(m -> 
                m.getEmail().equals(record.get("email"))).findFirst().orElseGet(() -> {
                            Member m = new Member();
                            m.setFullName(record.get("full_name"));
                            m.setEmail(record.get("email"));
                            m.setPlan(ownerPlan);
                            m.setProfiles(new ArrayList<>());
                            
                            ownerPlan.getMembers().add(m);

                            return m;
                        });
            
            /* Create profile */
            Profile profile = new Profile();
            profile.setMember(member);
            profile.setType(record.get("category").toString().toUpperCase().equals("PRODUCER") ? ProfileType.PRODUCER : ProfileType.CONSUMER);

            ProfileGraph graph = new ProfileGraph();
            for (int i = 0; i < 24; i++) {
                String column = "t" + i;
                Integer value = Integer.parseInt(record.get(column));
                graph.getGraph().add(value);
            }

            profile.setProfileGraph(graph);
            member.getProfiles().add(profile);
        }

        owner.setPlan(ownerPlan);

        return(modelMapper.map(userDao.save(owner).getPlan(), PlanDto.class));
    }

    @Override
    public PlanDto getPlanById(Long planId) {
        Plan plan = planDao.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + planId));
        return modelMapper.map(plan, PlanDto.class);
    }


    @Override
    public MemberDetailDto getMember(Long planId, Long memberId) {
        Member member = memberDao.findByIdAndPlanId(memberId, planId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Member with id " + memberId + " and plan id " + planId + " not found"));

        return modelMapper.map(member, MemberDetailDto.class);
    }

}
