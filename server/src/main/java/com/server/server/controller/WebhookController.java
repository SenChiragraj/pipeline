package com.server.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.server.actions.WebhookActions;
import com.server.server.models.BuildLogs;
import com.server.server.models.CommitInfo;
import com.server.server.models.WebhookLog;
import com.server.server.repository.BuildLogRepo;
import com.server.server.repository.WebhookLogRepo;
import com.server.server.service.C_IntegrationService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.ILoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

// WebhookController.java
@Slf4j
@RestController
@RequestMapping("/api/webhook")
public class WebhookController {


    @Autowired
    private BuildLogRepo buildLogRepo;

    @Autowired
    private WebhookLogRepo logRepo;

    @Autowired
    WebhookActions webhookActions;


    private static final String GITHUB_API_URL = "https://api.github.com/repos/";

    private static final Logger logger = LoggerFactory.getLogger(C_IntegrationService.class);


    @PostMapping("/create")
    public ResponseEntity<String> createWebhook(@RequestBody Map<String, String> request) {
        String repoFullName = request.get("repoFullName");
        String accessToken = request.get("accessToken");

        if (repoFullName == null || repoFullName.isEmpty()) {
            throw new IllegalArgumentException("repoFullName is required");
        }
        if (accessToken == null || accessToken.isEmpty()) {
            throw new IllegalArgumentException("accessToken is required");
        }

        logger.info(repoFullName + " " + accessToken);

        String responseBody = webhookActions.createWebhook(repoFullName, accessToken);
        return ResponseEntity.ok(responseBody);
    }


    @PostMapping("/receive")
    public ResponseEntity<String> receiveWebhook(@RequestBody Map<String, Object> payload) {

        String ref = (String) payload.get("ref"); // e.g. "refs/heads/dev"

        // 👇 Early return if it's not the dev branch
        if (ref == null || !ref.equals("refs/heads/dev")) {
            log.info("Push event ignored: not targeting dev branch. Received ref: {}", ref);
            return ResponseEntity.ok("Ignored: not dev branch");
        }

        BuildLogs buildLog = new BuildLogs();
        Map<String, Object> repository = (Map<String, Object>) payload.get("repository");
        String repoFullName = (String) repository.get("full_name");
        String accessToken = (String) payload.get("access_token");

        // Extract commits
        List<CommitInfo> commitInfos = webhookActions.parseCommits(payload, buildLog);

        // Create BuildLogs entry
        buildLog.setRepoName(repoFullName);
        buildLog.setCommits(commitInfos);
        buildLog.setTimestamp(Instant.now().toString()); // consistent ISO format
        buildLog.setStatus("pending"); // initial status
        buildLog.setMessage("Build triggered from push event");

        // Async build trigger
        webhookActions.triggerBuildAsync(repoFullName, accessToken, buildLog);
        return ResponseEntity.ok("Build triggered");

    }


    @GetMapping("/buildlogs")
    public ResponseEntity<List<BuildLogs>> getLogs() {
        List<BuildLogs> logs = buildLogRepo.findAll();
        return ResponseEntity.ok(logs);
    }


    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> listWebhooks(@RequestParam String repoFullName, @RequestParam String accessToken) {
        try {
            // GitHub API URL to list webhooks
            String url = GITHUB_API_URL + repoFullName + "/hooks";

            // Create the HTTP request with Authorization header
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github.v3+json")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Parse response into List of webhooks
                ObjectMapper objectMapper = new ObjectMapper();
                List<Map<String, Object>> webhooks = objectMapper.readValue(response.body(), List.class);
                return ResponseEntity.ok(webhooks);  // Return the list of webhooks
            } else {
                return ResponseEntity.status(response.statusCode()).body(null);  // Handle non-200 responses
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/logs")
    public List<WebhookLog> getLogs(@RequestParam String repo) {
        return logRepo.findByRepoFullNameOrderByTimestampDesc(repo);
    }

    @PostMapping("/trigger")
    public ResponseEntity<String> webhookTrigger(@RequestBody Map<String, Object> payload) {
        try {
            String repo = ((Map<String, Object>) payload.get("repository")).get("full_name").toString();
            String commit = ((List<Map<String, Object>>) payload.get("commits")).get(0).get("id").toString();

            // Define your command — change based on your project
            List<String> command = Arrays.asList("npm install", "npm test");

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.directory(new File("/path/to/your/project")); // Set to your local repo directory
            pb.redirectErrorStream(true); // Merge stderr into stdout

            Process process = pb.start();

            // Read the output of the command
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            String status = (exitCode == 0) ? "Success" : "Failure";

            // Save log to DB
            WebhookLog log = new WebhookLog();
            log.setRepoFullName(repo);
            log.setCommitId(commit);
            log.setStatus(status);
            log.setMessage(output.toString());
            log.setTimestamp(LocalDateTime.now());

            logRepo.save(log);

            return ResponseEntity.ok("Build executed with status: " + status);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Webhook processing failed: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteWebhook(
            @RequestParam String repoFullName,
            @RequestParam Long hookId,
            @RequestParam String accessToken) {

        String[] parts = repoFullName.split("/");
        if (parts.length != 2) {
            return ResponseEntity.badRequest().body("Invalid repoFullName");
        }

        String owner = parts[0];
        String repo = parts[1];

        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/hooks/" + hookId;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);

        return ResponseEntity.status(response.getStatusCode()).body("Deleted webhook: " + hookId);
    }

    @PostMapping("/push")
    public ResponseEntity<String> handlePushWebhook(@RequestBody Map<String, Object> payload) {
        try {
            String repoFullName = ((Map<String, String>) payload.get("repository")).get("full_name");
            List<Map<String, Object>> commits = (List<Map<String, Object>>) payload.get("commits");

            for (Map<String, Object> commit : commits) {
                String commitId = (String) commit.get("id");
                String message = (String) commit.get("message");

                // Simulate test run and status (for demo purpose)
                String status = Math.random() > 0.5 ? "SUCCESS" : "FAILURE";

                // Save log in DB
                WebhookLog log = new WebhookLog();
                log.setRepoFullName(repoFullName);
                log.setCommitId(commitId);
                log.setMessage(message);
                log.setTimestamp(LocalDateTime.now());
                log.setStatus(status);
                logRepo.save(log);
            }

            return ResponseEntity.ok("Logs stored successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing webhook");
        }
    }



}
