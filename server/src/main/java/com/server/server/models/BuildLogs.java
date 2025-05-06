package com.server.server.models;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "buildLogs")
public class BuildLogs {
// BuildLog.java

    @Id
    private String id;
    private String repoName;
    private String status; // 'success', 'failed', etc.
    private String logDetails;
    private String timestamp;

    // Constructors, getters, and setters
    public BuildLogs(String repoName, String status, String logDetails, String timestamp) {
        this.repoName = repoName;
        this.status = status;
        this.logDetails = logDetails;
        this.timestamp = timestamp;
    }

}

