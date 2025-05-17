package com.server.server.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "buildLogs")
public class BuildLogs {

    @Id
    private String id;

    private String repoName;
    private String status; // 'success', 'failed', etc.
    private String message;
    private String timestamp;

    private CommitUserModel pusher;
    private CommitUserModel author;  // Optional: author of HEAD commit or latest?

    private List<CommitInfo> commits;
    private String logs;
}
