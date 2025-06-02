package com.server.server.service;

import com.server.server.actions.YamlParser;
import com.server.server.models.PipeLineResponse;
import com.server.server.models.PipelineStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class PipelineService {

    @Autowired
    private GitService gitService;

    private static final Logger logger = LoggerFactory.getLogger(C_IntegrationService.class);

    public CompletableFuture<PipeLineResponse> runPipelineAsync(String repoFullName, String accessToken, StringBuilder logBuilder) {
        return CompletableFuture.supplyAsync(() -> {
            String baseCloneDir = "D:/PROJECTS/cicd/server/tmp/ci-repos/";
            String repoName = repoFullName.split("/")[1];

            try {
                // Clone repo
                boolean cloneSuccess = gitService.cloneRepo(repoFullName, accessToken, baseCloneDir);
                if (!cloneSuccess) {
                    return new PipeLineResponse("❌ Git clone failed", false);
                }

                // Load pipeline.yaml
                File yamlFile = new File(baseCloneDir + "/pipeline.yaml");
                if (!yamlFile.exists()) {
                    return new PipeLineResponse("❌ pipeline.yaml not found", false);
                }

                List<PipelineStep> steps = YamlParser.loadPipeline(yamlFile);

                String shell;
                String flag;

                if (System.getProperty("os.name").toLowerCase().contains("win")) {
                    shell = "cmd.exe";
                    flag = "/c";
                } else {
                    shell = "bash";
                    flag = "-c";
                }

                // Run each step
                for (PipelineStep step : steps) {
                    System.out.println("➡️ Running step: " + step.getName());
                    System.out.println("📁 Directory: " + baseCloneDir);
                    System.out.println("🔧 Command: " + step.getCommand());

                    ProcessBuilder pb = new ProcessBuilder(shell, flag, step.getCommand());
                    pb.directory(new File(baseCloneDir));
                    pb.redirectErrorStream(true);  // Combine stderr and stdout
                    Process process = pb.start();

                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                        String line;
                        while (step.getName().equalsIgnoreCase("Test") && (line = reader.readLine()) != null) {
                            System.out.println(line);  // Optional: still prints to console
                            logBuilder.append(line).append("\n");
                        }
                    }

                    int code = process.waitFor();

                    if (code != 0) {
                        return new PipeLineResponse("❌ Step failed: " + step.getName(), false);
                    }
                }


                return new PipeLineResponse("✅ All pipeline steps passed", true);

            } catch (Exception e) {
                return new PipeLineResponse("❌ Pipeline service failed: " + e.getMessage(), false);
            } finally {
                deleteDirectory(new File(baseCloneDir));
            }
        });
    }

    private void deleteDirectory(File dir) {
        try {
            if (!dir.exists()) return;

            if (dir.isDirectory()) {
                File[] entries = dir.listFiles();
                if (entries != null) {
                    for (File file : entries) {
                        deleteDirectory(file);
                    }
                }
            }

            if (!dir.delete()) {
                throw new IOException("Failed to delete directory or file.");
            }
//            logger.info("Deleted Clone🗑️");
        } catch (Exception e) {
            // Log a generic error without exposing the full path
            logger.error("Failed to delete a directory during cleanup: {}", e.getMessage());
        }
    }
}
