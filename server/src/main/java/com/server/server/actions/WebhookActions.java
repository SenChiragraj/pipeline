package com.server.server.actions;

import com.server.server.exceptions.BuildTriggerException;
import com.server.server.exceptions.InvalidPayloadException;
import com.server.server.exceptions.WebhookCreationException;
import com.server.server.models.BuildLogs;
import com.server.server.models.CommitInfo;
import com.server.server.models.CommitUserModel;
import com.server.server.repository.BuildLogRepo;
import com.server.server.service.C_IntegrationService;
import com.server.server.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class WebhookActions {

    @Autowired
    BuildLogRepo buildLogs;

    @Autowired
    NotificationService notificationService;

    @Autowired
    C_IntegrationService cIntegrationService;

    public String createWebhook(String repoFullName, String accessToken) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String webhookUrl = "https://pipeline-o6y4.onrender.com/api/webhook/receive";

            String jsonPayload = """
                {
                  "name": "web",
                  "active": true,
                  "events": ["push"],
                  "config": {
                    "url": "%s",
                    "content_type": "json"
                  }
                }
                """.formatted(webhookUrl);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/repos/" + repoFullName + "/hooks"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github.v3+json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                return response.body();
            } else {
                throw new WebhookCreationException("GitHub API responded with status: " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Failed to create webhook for repo {}: {}", repoFullName, e.getMessage());
            throw new WebhookCreationException("Failed to create webhook: " + e.getMessage());
        }
    }

    public String extractRepoFullName(Map<String, Object> payload) {
        try {
            Map<String, Object> repository = (Map<String, Object>) payload.get("repository");
            if (repository == null || !repository.containsKey("full_name")) {
                throw new InvalidPayloadException("Missing 'repository.full_name' in payload");
            }
            return (String) repository.get("full_name");
        } catch (ClassCastException e) {
            throw new InvalidPayloadException("Invalid 'repository' format in payload");
        }
    }


    public List<CommitInfo> parseCommits(Map<String, Object> payload, BuildLogs buildLog) {
        try {
            List<Map<String, Object>> commitList = (List<Map<String, Object>>) payload.get("commits");
            if (commitList == null) throw new InvalidPayloadException("Missing 'commits' in payload");

            List<CommitInfo> commitInfos = new ArrayList<>();

            for (Map<String, Object> commit : commitList) {
                String id = (String) commit.get("id");
                String message = (String) commit.get("message");
                String timestamp = (String) commit.get("timestamp");

                Map<String, Object> authorMap = (Map<String, Object>) commit.get("author");
                Map<String, Object> pusherMap = (Map<String, Object>) commit.get("committer");

                if (authorMap == null || pusherMap == null) {
                    throw new InvalidPayloadException("Missing 'author' or 'committer' in commit");
                }

                buildLog.setAuthor(new CommitUserModel(
                        (String) authorMap.get("name"),
                        (String) authorMap.get("email"),
                        (String) authorMap.get("username"))
                );

                buildLog.setPusher(new CommitUserModel(
                        (String) pusherMap.get("name"),
                        (String) pusherMap.get("email"),
                        (String) pusherMap.get("username"))
                );

                commitInfos.add(new CommitInfo(id, message, timestamp));
            }

            return commitInfos;
        } catch (ClassCastException e) {
            throw new InvalidPayloadException("Invalid format in commit data");
        }
    }


    public void triggerBuildAsync(String repoFullName, String accessToken, BuildLogs buildLog) {
        CompletableFuture.runAsync(() -> {
            notificationService.sendPushEvent("New push to " + repoFullName);
            StringBuilder logs = new StringBuilder();

            try {
                logs = cIntegrationService.triggerBuild(repoFullName, accessToken);
                buildLog.setStatus("success");
            } catch (Exception e) {
                buildLog.setStatus("failed");
                logs.append("Error: ").append(e.getMessage()).append("\n");
                throw new BuildTriggerException("Build failed for " + repoFullName);
            } finally {
                buildLog.setLogs(logs.toString());
                buildLogs.save(buildLog);
                log.info("Build log saved for repo: {}", repoFullName);
            }
        });
    }

}
