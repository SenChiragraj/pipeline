package com.server.server.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "buildLogs")
@Getter
@Setter
public class BuildLogs {

    @Id
    private String id;

    private String repoName;
    private String status;
    private String message;
    private String timestamp;

    private CommitUserModel pusher;
    private CommitUserModel author;

    private List<CommitInfo> commits;
    private String logs;

    // Reference to the owning project
    private String projectId;
}
