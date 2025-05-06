package com.server.server.repository;

import com.server.server.models.Webhook;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WebhookRepo extends MongoRepository<Webhook, String> {
    List<Webhook> findByRepoFullName(String repoFullName);
}
