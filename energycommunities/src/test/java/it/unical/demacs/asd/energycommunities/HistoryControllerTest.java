package it.unical.demacs.asd.energycommunities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import it.unical.demacs.asd.energycommunities.controller.HistoryController;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HistoryControllerTest {

    @Mock
    private HistoryService historyService;

    private HistoryController historyController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        objectMapper = new ObjectMapper();

        historyController = new HistoryController(historyService);
    }

    @Test
    void testGetHistoryMembers() {
        Long historyId = 1L;

        ObjectNode analysisData = objectMapper.createObjectNode();
        analysisData.putArray("assignments").add(10).add(20);

        HistoryDetailDto mockDto = new HistoryDetailDto();
        mockDto.setId(historyId);
        mockDto.setAnalysisData(analysisData);


        when(historyService.getHistoryById(historyId)).thenReturn(mockDto);

        ResponseEntity<Object> response = historyController.getHistoryMembers(historyId);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        JsonNode body = (JsonNode) response.getBody();
        assertNotNull(body);
        assertTrue(body.isArray());
        assertEquals(10, body.get(0).asInt());

        verify(historyService, times(1)).getHistoryById(historyId);
    }

    @Test
    void testGetHistoryMembers_NotFound() {
        when(historyService.getHistoryById(99L)).thenReturn(null);

        ResponseEntity<Object> response = historyController.getHistoryMembers(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}