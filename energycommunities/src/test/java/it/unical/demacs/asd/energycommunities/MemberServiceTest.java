package it.unical.demacs.asd.energycommunities;


import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import it.unical.demacs.asd.energycommunities.data.utils.MemberType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MemberServiceTest {

    @Mock
    private MemberService memberService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllById() {
        // Preparo DTO di esempio
        MemberDetailDto member1 = new MemberDetailDto();
        member1.setId(1L);
        member1.setFullName("Mario Rossi");
        member1.setEmail("mario@example.com");
        member1.setMemberType(MemberType.PRODUCER);
        member1.setPlanId(10L);

        MemberDetailDto member2 = new MemberDetailDto();
        member2.setId(2L);
        member2.setFullName("Luca Bianchi");
        member2.setEmail("luca@example.com");
        member2.setMemberType(MemberType.CONSUMER);
        member2.setPlanId(20L);

        List<MemberDetailDto> expectedList = List.of(member1, member2);

        // Mock comportamento
        when(memberService.findAllById(List.of(1L, 2L))).thenReturn(expectedList);

        // Call
        List<MemberDetailDto> result = memberService.findAllById(List.of(1L, 2L));

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());

        // Check primo membro
        MemberDetailDto r1 = result.get(0);
        assertEquals(1L, r1.getId());
        assertEquals("Mario Rossi", r1.getFullName());
        assertEquals("mario@example.com", r1.getEmail());
        assertEquals(MemberType.PRODUCER, r1.getMemberType());
        assertEquals(10L, r1.getPlanId());

        // Check secondo membro
        MemberDetailDto r2 = result.get(1);
        assertEquals(2L, r2.getId());
        assertEquals("Luca Bianchi", r2.getFullName());
        assertEquals("luca@example.com", r2.getEmail());
        assertEquals(MemberType.CONSUMER, r2.getMemberType());
        assertEquals(20L, r2.getPlanId());

        // Verifica che il mock sia stato chiamato una volta
        verify(memberService, times(1)).findAllById(List.of(1L, 2L));
    }
}

