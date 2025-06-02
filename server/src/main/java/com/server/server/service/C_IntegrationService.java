package com.server.server.service;

import com.server.server.models.BuildLogs;
import com.server.server.models.PipeLineResponse;
import com.server.server.repository.BuildLogRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.CompletableFuture;

@Service
public class C_IntegrationService {

    @Autowired
    private BuildLogRepo buildLogRepo;

    @Autowired
    NotificationService notificationService;

    @Autowired
    GitService gitService;

    @Autowired
    PipelineService pipelineService;

    private static final Logger logger = LoggerFactory.getLogger(C_IntegrationService.class);

    public StringBuilder triggerBuild(String repoFullName, String accessToken)  {
        String status = "success";
        StringBuilder logBuilder = new StringBuilder();
//        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

//        String repoName = repoFullName.split("/")[1];

        try {
            // 1. Clean previous clone (cross-platform)

            CompletableFuture<PipeLineResponse> future = pipelineService.runPipelineAsync(repoFullName, accessToken, logBuilder);
            PipeLineResponse pipeLineResponse = future.get();  // This blocks until the pipeline finishes

            if (pipeLineResponse.isSuccess()) {
                status = "passed";
                logBuilder.append("✅ All steps passed\n");
            } else {
                status = "failed";
                logBuilder.append("❌ Pipeline failed: ").append(pipeLineResponse.getMessage()).append("\n");
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            logBuilder.append("Cleaned previous " + "clone.\n");
            notificationService.sendBuildStatus("Build Completed" + repoFullName);
        }
        return logBuilder;
//        saveLogAndReturn(repoFullName, status, logBuilder, timestamp);
    }

    // Helper to log process output
    private void logProcessOutput(Process process, StringBuilder logBuilder) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                logBuilder.append(line).append("\n");
            }
        }
    }

    // Helper to delete directory recursively (cross-platform)




    // Helper to get correct npm command for OS
    private String getNpmCommand() {
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) {
            return "npm.cmd"; // Windows
        } else {
            return "npm";     // Linux/Mac
        }
    }

    // Helper to save log and log to logger
//    private void saveLogAndReturn(String repoFullName, String status, StringBuilder logBuilder, String timestamp) {
////        BuildLogs log = new BuildLogs(repoFullName, status, logBuilder.toString(), timestamp);
//        try {
//            buildLogRepo.save(log);
//            logger.info("Build log saved to DB.");
//        } catch (Exception e) {
//            logger.error("Failed to save build log to DB: {}", e.getMessage(), e);
//        }
//
//    }
}
