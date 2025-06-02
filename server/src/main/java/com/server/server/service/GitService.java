package com.server.server.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class GitService {

    private static final Logger logger = LoggerFactory.getLogger(C_IntegrationService.class);

    public boolean cloneRepo(String repoFullName, String accessToken, String cloneDir) throws IOException, InterruptedException {
//        ProcessBuilder pb = new ProcessBuilder("git", "clone", repoUrl, localPath);
        try {
            // 2. Clone the repo
            String cloneCommand = "git clone --depth=1 -b dev https://oauth2:" + accessToken + "@github.com/" + repoFullName + ".git " + cloneDir;
            Process cloneProcess = Runtime.getRuntime().exec(cloneCommand);
//        logProcessOutput(cloneProcess, logBuilder);
            int cloneExit = cloneProcess.waitFor();
            return cloneExit == 0;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void mergeToProd(String localPath) throws IOException, InterruptedException {
        runCmd("git checkout prod", localPath);
        int mergeCode = runCmd("git merge main", localPath);
        if (mergeCode == 0) {
            runCmd("git push origin prod", localPath);
        } else {
            System.err.println("Merge conflict!");
        }
    }

    private int runCmd(String cmd, String path) throws IOException, InterruptedException {
        Process p = new ProcessBuilder("bash", "-c", cmd)
                .directory(new File(path))
                .inheritIO()
                .start();
        return p.waitFor();
    }

}
