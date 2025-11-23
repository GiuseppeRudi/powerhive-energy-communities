package it.unical.demacs.asd.energycommunities.controller;

import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import lombok.Getter;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
public class ClingoStreamController {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private final ExecutorService sseExecutor = Executors.newCachedThreadPool();

    @GetMapping(value = "/clingo-stream/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public SseEmitter streamEvents() {
        SseEmitter emitter = new SseEmitter(0L);

        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        return emitter;
    }

    public void sendEvent(String eventName, long analysisId) {
        sseExecutor.submit(() -> {
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name(eventName)
                            .data(analysisId)
                    );
                } catch (IOException e) {
                    emitters.remove(emitter);
                }
            }
        });
    }

}

