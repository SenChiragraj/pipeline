package com.server.server.controller;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/build")
public class BuildEventController {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping(path = "/stream" , produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamBuildEvents() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    // Simulate a push or test event (for demo/testing)
    @PostMapping("/notify")
    public void notifyBuildEvent(@RequestParam String message) {
        sendBuildEvent(message);
    }

    // Call this method from your actual build/pu   sh/test logic
    public void sendBuildEvent(String message) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("buildEvent")
                        .data(message));
            } catch (IOException e) {
                emitter.complete();
                emitters.remove(emitter);
            }
        }
    }
}

