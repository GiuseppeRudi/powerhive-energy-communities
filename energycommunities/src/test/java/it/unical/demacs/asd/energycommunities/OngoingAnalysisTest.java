package it.unical.demacs.asd.energycommunities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.implementation.OngoingAnalysisServiceImpl;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.OngoingAnalysisDto;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;

@ExtendWith(MockitoExtension.class)
public class OngoingAnalysisTest {

    @Mock
    private OngoingAnalysisDao ongoingAnalysisDao;

    @Mock
    private ModelMapper modelMapper;

    private final ObjectMapper mapper = new ObjectMapper();

    @InjectMocks
    private OngoingAnalysisServiceImpl ongoingAnalysisService;

    private OngoingAnalysis mockOngoingAnalysis;
    private OngoingAnalysisDto mockOngoingAnalysisDto;
    private User mockUser;

    private final Long testUserId = 1L;
    private final Long testAnalysisId = 100L;

    @BeforeEach
    void setUp() throws JsonProcessingException {
        mockUser = new User();
        mockUser.setId(testUserId);
        mockUser.setUsername("user");
        mockUser.setEmail("adsfa@gmail.com");

        mockOngoingAnalysis = new OngoingAnalysis();
        mockOngoingAnalysis.setId(testAnalysisId);
        mockOngoingAnalysis.setUser(mockUser);
        mockOngoingAnalysis.setAnalysisType(1);
        mockOngoingAnalysis.setStatus("RUNNING");
        mockOngoingAnalysis.setCreatedAt(LocalDateTime.now());
        mockOngoingAnalysis.setResultModel(mapper.readTree("\"niente niente\""));
        mockOngoingAnalysis.setMemberIds(List.of(50L));

        mockOngoingAnalysisDto = new OngoingAnalysisDto();
        mockOngoingAnalysisDto.setId(testAnalysisId);
        mockOngoingAnalysisDto.setUserId(testUserId);
        mockOngoingAnalysisDto.setAnalysisType(1);
        mockOngoingAnalysisDto.setStatus("RUNNING");
        mockOngoingAnalysisDto.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testFindByUserId() {
        when(ongoingAnalysisDao.findByUserId(testUserId)).thenReturn(List.of(mockOngoingAnalysis));
        when(modelMapper.map(mockOngoingAnalysis, OngoingAnalysisDto.class)).thenReturn(mockOngoingAnalysisDto);

        List<OngoingAnalysisDto> result = ongoingAnalysisService.findByUserId(testUserId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAnalysisId, result.getFirst().getId());
        assertEquals("RUNNING", result.getFirst().getStatus());
        assertEquals(1, result.getFirst().getAnalysisType());
        verify(ongoingAnalysisDao).findByUserId(testUserId);
    }

    @Test
    void testFindByUserIdEmpty() {
        when(ongoingAnalysisDao.findByUserId(testUserId)).thenReturn(new ArrayList<>());

        List<OngoingAnalysisDto> result = ongoingAnalysisService.findByUserId(testUserId);

        assertNotNull(result);
        assertEquals(0, result.size());
        verify(ongoingAnalysisDao).findByUserId(testUserId);
    }

    @Test
    void testSave() {
        when(ongoingAnalysisDao.save(any(OngoingAnalysis.class))).thenReturn(mockOngoingAnalysis);

        OngoingAnalysis result = ongoingAnalysisService.save(mockOngoingAnalysis);

        assertNotNull(result);
        assertEquals(testAnalysisId, result.getId());
        assertEquals("RUNNING", result.getStatus());
        assertEquals(1, result.getAnalysisType());
        assertEquals(1, result.getMemberIds().size());
        verify(ongoingAnalysisDao).save(mockOngoingAnalysis);
    }

    @Test
    void testFindById() {
        when(ongoingAnalysisDao.findById(testAnalysisId)).thenReturn(Optional.ofNullable(mockOngoingAnalysis));

        OngoingAnalysis result = ongoingAnalysisService.findById(testAnalysisId);

        assertNotNull(result);
        assertEquals(testAnalysisId, result.getId());
        assertEquals(mockUser, result.getUser());
        assertEquals("RUNNING", result.getStatus());
        assertEquals("niente niente", result.getResultModel().asText());
        assertEquals(List.of(50L), result.getMemberIds());
        verify(ongoingAnalysisDao).findById(testAnalysisId);
    }

    @Test
    void testFindByIdNotFound() {
        when(ongoingAnalysisDao.findById(999L)).thenReturn(Optional.empty());

        OngoingAnalysis result = ongoingAnalysisService.findById(999L);

        assertNull(result);
        verify(ongoingAnalysisDao).findById(999L);
    }

    @Test
    void testDeleteById() {
        ongoingAnalysisService.deleteById(testAnalysisId);
        verify(ongoingAnalysisDao).deleteById(testAnalysisId);
    }

    @Test
    void testFindByUserIdMultipleAnalyses() throws JsonProcessingException {
        OngoingAnalysis second = new OngoingAnalysis();
        second.setId(200L);
        second.setUser(mockUser);
        second.setAnalysisType(2);
        second.setStatus("FINISHED");
        second.setCreatedAt(LocalDateTime.now().minusHours(1));
        second.setMemberIds(new ArrayList<>());
        second.setResultModel(mapper.readTree("\"completed model\""));

        OngoingAnalysisDto secondDto = new OngoingAnalysisDto();
        secondDto.setId(200L);
        secondDto.setUserId(testUserId);
        secondDto.setAnalysisType(2);
        secondDto.setStatus("FINISHED");

        List<OngoingAnalysis> list = List.of(mockOngoingAnalysis, second);

        when(ongoingAnalysisDao.findByUserId(testUserId)).thenReturn(list);
        when(modelMapper.map(mockOngoingAnalysis, OngoingAnalysisDto.class)).thenReturn(mockOngoingAnalysisDto);
        when(modelMapper.map(second, OngoingAnalysisDto.class)).thenReturn(secondDto);

        List<OngoingAnalysisDto> result = ongoingAnalysisService.findByUserId(testUserId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("RUNNING", result.get(0).getStatus());
        assertEquals("FINISHED", result.get(1).getStatus());
        assertEquals(1, result.get(0).getAnalysisType());
        assertEquals(2, result.get(1).getAnalysisType());
        verify(ongoingAnalysisDao).findByUserId(testUserId);
    }

    @Test
    void testFindByIdWithMultipleMemberIds() {
        mockOngoingAnalysis.setMemberIds(List.of(50L, 51L));

        when(ongoingAnalysisDao.findById(testAnalysisId)).thenReturn(Optional.ofNullable(mockOngoingAnalysis));

        OngoingAnalysis result = ongoingAnalysisService.findById(testAnalysisId);

        assertNotNull(result);
        assertEquals(2, result.getMemberIds().size());
        assertEquals(50L, result.getMemberIds().get(0));
        assertEquals(51L, result.getMemberIds().get(1));
        verify(ongoingAnalysisDao).findById(testAnalysisId);
    }
}
