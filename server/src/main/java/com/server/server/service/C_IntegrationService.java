package com.server.server.service;

import com.server.server.models.BuildLogs;
import com.server.server.repository.BuildLogRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class C_IntegrationService {

    @Autowired
    private BuildLogRepo buildLogRepo;

    @Autowired
    NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(C_IntegrationService.class);

    public StringBuilder triggerBuild(String repoFullName, String accessToken)  {
        String status = "success";
        StringBuilder logBuilder = new StringBuilder();
//        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

//        String repoName = repoFullName.split("/")[1];
        String cloneDir = "D:/PROJECTS/cicd/server/tmp/ci-repos/";

        try {
            // 1. Clean previous clone (cross-platform)

            // 2. Clone the repo
            String cloneCommand = "git clone --depth=1 https://oauth2:" + accessToken + "@github.com/" + repoFullName + ".git " + cloneDir;
            Process cloneProcess = Runtime.getRuntime().exec(cloneCommand);
            logProcessOutput(cloneProcess, logBuilder);
            int cloneExit = cloneProcess.waitFor();
            if (cloneExit != 0) {
                status = "failed";
                logBuilder.append("Git clone failed\n");
                return logBuilder;
            }
            logBuilder.append("Cloning completed.\n");
            logger.info("Cloning complete");
            // 3. Run npm install
            String npmCmd = getNpmCommand();
            ProcessBuilder installPb = new ProcessBuilder(npmCmd, "install");
            installPb.directory(new File(cloneDir));
            installPb.redirectErrorStream(true);
            Process installProcess = installPb.start();
            logProcessOutput(installProcess, logBuilder);
            int installExit = installProcess.waitFor();
            if (installExit != 0) {
                status = "failed";
                logBuilder.append("npm install failed\n");
//                saveLogAndReturn(repoFullName, status, logBuilder, timestamp);
                return logBuilder;
            }
            logBuilder.append("npm install completed.\n");


            // 4. Run npm test
            ProcessBuilder testPb = new ProcessBuilder(npmCmd, "test");
            testPb.directory(new File(cloneDir));
            testPb.redirectErrorStream(true);
            Process testProcess = testPb.start();
            logProcessOutput(testProcess, logBuilder);
            int testExit = testProcess.waitFor();
            if (testExit != 0) {
                status = "failed";
                logBuilder.append("npm test failed\n");
                throw new Exception("Test Cases Failed");
            } else {
                logBuilder.append("Test Cases Passed✅.\n");
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            deleteDirectory(new File(cloneDir));
            logBuilder.append("Cleaned previous clone.\n");
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
