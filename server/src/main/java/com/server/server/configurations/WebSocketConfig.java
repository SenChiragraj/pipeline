package com.server.server.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint that React app connects to
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
}

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // For broadcasting messages
        registry.enableSimpleBroker("/topic");
        // For receiving messages from client (if needed)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
