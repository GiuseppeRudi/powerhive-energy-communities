package it.unical.demacs.asd.energycommunities;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.mock.web.MockMultipartFile;

import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.PlanDao;
import it.unical.demacs.asd.energycommunities.data.dao.ProfileDao;
import it.unical.demacs.asd.energycommunities.data.dao.ProfileGraphDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.implementation.PlanServiceImpl;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanSummaryDto;
import it.unical.demacs.asd.energycommunities.exception.ElementNotFoundException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doNothing;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.naming.NameNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.server.ResponseStatusException;

import it.unical.demacs.asd.energycommunities.dto.member.ManualMemberDto;

@ExtendWith(MockitoExtension.class)
public class PlanServiceTests {

    @Mock
    private PlanDao planDao;
    @Mock
    private UserDao userDao;
    @Mock
    private MemberDao memberDao;
    @Mock
    private ProfileDao profileDao;
    @Mock
    private ProfileGraphDao profileGraphDao;
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    PlanServiceImpl planService;

    private User owner;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
    }

    private final String csvContent = "full_name,email,category,t0,t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23\n"
            +
            "John Doe,john@example.com,producer,"
            + "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24";

    @SuppressWarnings("null")
    @Test
    void testUpload() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "plan.csv",
                "text/csv",
                csvContent.getBytes(StandardCharsets.UTF_8));

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(planDao.findByUser(owner)).thenReturn(Optional.empty());
        when(userDao.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(modelMapper.map(any(Plan.class), eq(PlanSummaryDto.class))).thenReturn(new PlanSummaryDto());

        PlanSummaryDto result = planService.upload(file, 1L);

        assertNotNull(result);
        verify(userDao, times(1)).findById(1L);
        verify(userDao, times(1)).save(owner);
        assertNotNull(owner.getPlan());
        assertNotNull(owner.getPlan().getMembers());
        assertNotNull(owner.getPlan().getMembers().get(0));
        assertNotNull(owner.getPlan().getMembers().get(0).getProfiles());
        assertNotNull(owner.getPlan().getMembers().get(0).getProfiles().get(0).getProfileGraph());
    }

    @Test
    void testGetSummaryPlanById() {
        Plan plan = new Plan();
        plan.setId(1L);

        when(planDao.findById(1L)).thenReturn(Optional.of(plan));
        when(modelMapper.map(plan, PlanSummaryDto.class)).thenReturn(new PlanSummaryDto());

        PlanSummaryDto result = planService.getSummaryPlanById(1L);

        assertNotNull(result);
        verify(planDao).findById(1L);
    }

    @Test
    void testGetMember() {
        Member member = new Member();
        member.setId(10L);

        when(memberDao.findByIdAndPlanId(10L, 1L)).thenReturn(Optional.of(member));
        when(modelMapper.map(member, MemberDetailDto.class)).thenReturn(new MemberDetailDto());

        MemberDetailDto result = planService.getMember(1L, 10L);

        assertNotNull(result);
        verify(memberDao).findByIdAndPlanId(10L, 1L);
    }

    @Test
    void testAddMember_Success_NewMember() throws NameNotFoundException {
        // ARRANGE
        ManualMemberDto dto = new ManualMemberDto();
        dto.setEmail("new.member@example.com");
        dto.setFullName("New Member");
        dto.setCategory("PRODUCER");
        List<Integer> values = new ArrayList<>(Collections.nCopies(24, 10));
        dto.setEnergyValues(values);

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(planDao.findByUser(owner)).thenReturn(Optional.empty());
        when(modelMapper.map(any(Member.class), eq(MemberDetailDto.class))).thenReturn(new MemberDetailDto());

        MemberDetailDto result = planService.addMember(dto, 1L);

        assertNotNull(result);
        verify(userDao).findById(1L);
        verify(planDao).findByUser(owner);
        verify(planDao).save(any(Plan.class));
        verify(modelMapper).map(any(Member.class), eq(MemberDetailDto.class));

        assertNotNull(owner.getPlan());
        assertEquals(1, owner.getPlan().getMembers().size());
        assertEquals("new.member@example.com", owner.getPlan().getMembers().get(0).getEmail());
        assertEquals(1, owner.getPlan().getMembers().get(0).getProfiles().size());
        assertEquals(24, owner.getPlan().getMembers().get(0).getProfiles().get(0).getProfileGraph().getGraph().size());
    }

    @Test
    void testAddMember_Fail_UserNotFound() {
        ManualMemberDto dto = new ManualMemberDto();
        when(userDao.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NameNotFoundException.class, () -> {
            planService.addMember(dto, 99L);
        });

        verify(userDao).findById(99L);
        verify(planDao, never()).save(any());
    }

    @Test
    void testAddMember_Fail_EmailConflict() {
        ManualMemberDto dto = new ManualMemberDto();
        dto.setEmail("existing.member@example.com");
        dto.setFullName("NOME DIVERSO");
        dto.setCategory("CONSUMER");
        dto.setEnergyValues(new ArrayList<>(Collections.nCopies(24, 5)));

        Member existingMember = new Member();
        existingMember.setEmail("existing.member@example.com");
        existingMember.setFullName("Nome Originale");

        Plan existingPlan = new Plan();
        existingPlan.setUser(owner);
        existingPlan.setMembers(new ArrayList<>(List.of(existingMember)));

        owner.setPlan(existingPlan);

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(planDao.findByUser(owner)).thenReturn(Optional.of(existingPlan));

        assertThrows(ResponseStatusException.class, () -> {
            planService.addMember(dto, 1L);
        });

        verify(userDao).findById(1L);
        verify(planDao).findByUser(owner);
        verify(planDao, never()).save(any(Plan.class));
    }

    @Test
    void testAddMember_Fail_InvalidEnergyValues() {
        ManualMemberDto dto = new ManualMemberDto();
        dto.setEmail("new.member@example.com");
        dto.setFullName("New Member");
        dto.setCategory("PRODUCER");
        List<Integer> values = new ArrayList<>(Collections.nCopies(23, 10));
        dto.setEnergyValues(values);

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(planDao.findByUser(owner)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            planService.addMember(dto, 1L);
        });

        verify(userDao).findById(1L);
        verify(planDao, never()).save(any(Plan.class));
    }

    @Test
    void testDeleteMemberFromPlan_Success() throws NameNotFoundException {
        Plan plan = new Plan();
        plan.setId(5L);

        Member member = new Member();
        member.setId(10L);
        member.setPlan(plan);

        owner.setPlan(plan);

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(memberDao.findByIdAndPlanId(10L, 5L)).thenReturn(Optional.of(member));
        doNothing().when(memberDao).delete(any(Member.class));

        planService.deleteMemberFromPlan(10L, 1L);

        verify(userDao).findById(1L);
        verify(memberDao).findByIdAndPlanId(10L, 5L);
        verify(memberDao, times(1)).delete(member);
    }

    @Test
    void testDeleteMemberFromPlan_Fail_PlanNotFound() {
        when(userDao.findById(1L)).thenReturn(Optional.of(owner));

        assertThrows(EntityNotFoundException.class, () -> {
            planService.deleteMemberFromPlan(10L, 1L);
        });

        verify(userDao).findById(1L);
        verify(memberDao, never()).findByIdAndPlanId(any(), any());
        verify(memberDao, never()).delete(any());
    }

    @Test
    void testDeleteMemberFromPlan_Fail_MemberNotFound() {
        Plan plan = new Plan();
        plan.setId(5L);
        owner.setPlan(plan);

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(memberDao.findByIdAndPlanId(99L, 5L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            planService.deleteMemberFromPlan(99L, 1L);
        });

        verify(userDao).findById(1L);
        verify(memberDao).findByIdAndPlanId(99L, 5L);
        verify(memberDao, never()).delete(any());
    }

    @Test
    void testAddNewMember_Success() {
        Long ownerId = 1L;
        Plan ownerPlan = new Plan();
        ownerPlan.setId(5L);
        owner.setPlan(ownerPlan);
        owner.setEmail("owner@example.com");

        MemberDetailDto inputDto = new MemberDetailDto();
        inputDto.setFullName("Nuovo Membro");
        inputDto.setEmail("nuovo.membro@example.com");

        Member savedMember = new Member();
        savedMember.setId(10L);
        savedMember.setFullName(inputDto.getFullName());
        savedMember.setEmail(inputDto.getEmail());
        savedMember.setPlan(ownerPlan);

        MemberDetailDto expectedDto = new MemberDetailDto();
        expectedDto.setId(10L);
        expectedDto.setFullName(inputDto.getFullName());
        expectedDto.setEmail(inputDto.getEmail());

        when(userDao.findById(ownerId)).thenReturn(Optional.of(owner));
        when(memberDao.save(any(Member.class))).thenReturn(savedMember);
        when(modelMapper.map(eq(savedMember), eq(MemberDetailDto.class))).thenReturn(expectedDto);

        MemberDetailDto result = planService.add_new_member(inputDto, ownerId);

        assertNotNull(result);
        assertEquals(expectedDto.getId(), result.getId());
        assertEquals(expectedDto.getEmail(), result.getEmail());

        verify(userDao, times(1)).findById(ownerId);
        verify(memberDao, times(1)).save(any(Member.class));
        verify(modelMapper, times(1)).map(eq(savedMember), eq(MemberDetailDto.class));

        verify(memberDao).save(any(Member.class));
    }

    @Test
    void testAddNewMember_Fail_OwnerIdIsNull() {
        MemberDetailDto inputDto = new MemberDetailDto();

        assertThrows(IllegalArgumentException.class, () -> {
            planService.add_new_member(inputDto, null);
        });

        verify(userDao, never()).findById(any());
        verify(memberDao, never()).save(any());
    }

    @Test
    void testAddNewMember_Fail_OwnerNotFound() {
        Long nonExistentOwnerId = 99L;
        MemberDetailDto inputDto = new MemberDetailDto();

        when(userDao.findById(nonExistentOwnerId)).thenReturn(Optional.empty());

        assertThrows(ElementNotFoundException.class, () -> {
            planService.add_new_member(inputDto, nonExistentOwnerId);
        });

        verify(userDao, times(1)).findById(nonExistentOwnerId);
        verify(memberDao, never()).save(any());
    }

    @Test
    void testAddNewMember_SetsCorrectPlan() {
        Long ownerId = 1L;
        Plan expectedPlan = new Plan();
        expectedPlan.setId(7L);
        owner.setPlan(expectedPlan);

        MemberDetailDto inputDto = new MemberDetailDto();
        inputDto.setFullName("Membro con Plan");
        inputDto.setEmail("plan.check@example.com");

        when(userDao.findById(ownerId)).thenReturn(Optional.of(owner));

        when(memberDao.save(any(Member.class))).thenAnswer(invocation -> {
            Member memberToSave = invocation.getArgument(0);
            assertEquals(expectedPlan.getId(), memberToSave.getPlan().getId());
            memberToSave.setId(20L);
            return memberToSave;
        });

        when(modelMapper.map(any(Member.class), eq(MemberDetailDto.class))).thenReturn(new MemberDetailDto());

        planService.add_new_member(inputDto, ownerId);

        verify(userDao, times(1)).findById(ownerId);
        verify(memberDao, times(1)).save(any(Member.class));
    }

}
