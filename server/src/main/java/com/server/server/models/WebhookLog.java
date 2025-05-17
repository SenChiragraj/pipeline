package com.server.server.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "webhook_logs")
public class WebhookLog {

    @Id
    private String id;
    private String repoFullName;
    private String commitId;
    private String status;
    private String message;
    private LocalDateTime timestamp;

}
