package com.server.server.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommitInfo {
    private String commitId;
    private String message;
    private String timestamp;

    public CommitInfo () {

    }

    public CommitInfo(String commitId, String message, String timestamp) {
        this.commitId = commitId;
        this.message = message;
        this.timestamp = timestamp;
    }
}
