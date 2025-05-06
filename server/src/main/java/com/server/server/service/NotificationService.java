package com.server.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendPushEvent(String message) {
        messagingTemplate.convertAndSend("/topic/push", message);
    }

    public void sendBuildStatus(String statusMessage) {
        messagingTemplate.convertAndSend("/topic/build", statusMessage);
    }

    public void sendErrorStatus(String statusMessage) {
        messagingTemplate.convertAndSend("/topic/error", statusMessage);
    }
}
