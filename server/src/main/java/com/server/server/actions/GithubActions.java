package com.server.server.actions;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GithubActions {

    private void mergeDevToProd(String accessToken, String repoFullName) throws IOException {
        String url = "https://api.github.com/repos/" + repoFullName + "/merges";
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
        String commitMessage = "Auto-merging dev to prod at " + timestamp;

        String jsonPayload = String.format(
                "{ \"base\": \"prod\", \"head\": \"dev\", \"commit_message\": \"%s\" }",
                commitMessage
        );


        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Authorization", "token " + accessToken);
        con.setRequestProperty("Accept", "application/vnd.github.v3+json");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (OutputStream os = con.getOutputStream()) {
            byte[] input = jsonPayload.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = con.getResponseCode();
        if (responseCode != 201 && responseCode != 200) {
            throw new RuntimeException("Failed to merge: HTTP error code " + responseCode);
        }
    }



}

