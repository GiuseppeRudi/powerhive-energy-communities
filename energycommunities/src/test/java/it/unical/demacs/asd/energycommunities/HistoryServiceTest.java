package it.unical.demacs.asd.energycommunities;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistorySummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HistoryServiceTest {

    @Mock
    private HistoryService historyService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();
    }

    @Test
    void testSaveAnalysis() throws Exception {
        JsonNode analysisData = objectMapper.readTree("{\"example\": 123}");
        HistoryDetailDto expected = new HistoryDetailDto(1L, "Test Analysis", 1, analysisData, "2025-11-09T10:00:00");

        when(historyService.saveAnalysis(1L, 1, analysisData, "Test Analysis")).thenReturn(expected);

        HistoryDetailDto result = historyService.saveAnalysis(1L, 1, analysisData, "Test Analysis");

        assertNotNull(result);
        assertEquals("Test Analysis", result.getName());
        assertEquals(1, result.getAnalysisNumber());
        verify(historyService, times(1)).saveAnalysis(1L, 1, analysisData, "Test Analysis");
    }

    @Test
    void testGetAllHistoriesByUserId() {
        HistorySummaryDto summary = new HistorySummaryDto(1L, "Test Analysis", 1, "2025-11-09T10:00:00");
        when(historyService.getAllHistoriesByUserId(1L)).thenReturn(List.of(summary));

        List<HistorySummaryDto> result = historyService.getAllHistoriesByUserId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Analysis", result.get(0).getName());
    }

    @Test
    void testGetHistoryById() {
        JsonNode analysisData = objectMapper.createObjectNode().put("example", 123);
        HistoryDetailDto expected = new HistoryDetailDto(1L, "Test Analysis", 1, analysisData, "2025-11-09T10:00:00");

        when(historyService.getHistoryById(1L)).thenReturn(expected);

        HistoryDetailDto result = historyService.getHistoryById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Analysis", result.getName());
    }
}
