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
import it.unical.demacs.asd.energycommunities.dto.user.PlanDto;

@ExtendWith(MockitoExtension.class)
public class PlanServiceTests {

    @Mock private PlanDao planDao;
    @Mock private UserDao userDao;
    @Mock private MemberDao memberDao;
    @Mock private ProfileDao profileDao;
    @Mock private ProfileGraphDao profileGraphDao;
    @Mock private ModelMapper modelMapper;

    @InjectMocks PlanServiceImpl planService;

    private User owner;

    @BeforeEach
    void setUp(){
        owner = new User();
        owner.setId(1L);
    }

    private final String csvContent =
            "full_name,email,category,t0,t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23\n" +
            "John Doe,john@example.com,producer,"
            + "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24";

    @Test
    void testUpload() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "data.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(userDao.findById(1L)).thenReturn(Optional.of(owner));
        when(planDao.save(any(Plan.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userDao.save(any(User.class))).thenReturn(owner);
        when(modelMapper.map(any(Plan.class), eq(PlanDto.class))).thenReturn(new PlanDto());

        PlanDto result = planService.upload(file, 1L);

        assertNotNull(result);
        verify(planDao, times(1)).save(any(Plan.class));
        verify(userDao, times(1)).save(owner);
    }

    @Test
    void testGetPlanById() {
        Plan plan = new Plan();
        plan.setId(1L);

        when(planDao.findById(1L)).thenReturn(Optional.of(plan));
        when(modelMapper.map(plan, PlanDto.class)).thenReturn(new PlanDto());

        PlanDto result = planService.getPlanById(1L);

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
}
