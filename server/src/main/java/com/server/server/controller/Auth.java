package com.server.server.controller;

//import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
@RequestMapping("/oauth")
public class Auth {

    @Autowired
    Environment environment;

    @Value("${github.client.id}")
    private String clientId;

    @Value("${github.client.secret}")
    private String clientSecret;

    @GetMapping("/callback")
    public ResponseEntity<String> githubCallback(@RequestParam String code) {
        try {
            // Exchange code for access token
            HttpClient client = HttpClient.newHttpClient();
            String body = "client_id=" + clientId +
                    "&client_secret=" + clientSecret +
                    "&code=" + code;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://github.com/login/oauth/access_token"))
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.ok(response.body()); // Returns access token JSON
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("OAuth failed");
        }
    }
}
