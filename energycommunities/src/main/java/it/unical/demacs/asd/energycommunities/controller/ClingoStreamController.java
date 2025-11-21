package it.unical.demacs.asd.energycommunities.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/clingo-stream")
public class ClingoStreamController {

    private final SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

    @GetMapping("/events")
    public SseEmitter streamEvents() {
        return emitter;
    }

    public void sendEvent(String eventName, long analysisId) {
        try {
            emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(analysisId));
        } catch (Exception e) {
            System.out.println("SSE error: " + e.getMessage());
        }
    }
}

