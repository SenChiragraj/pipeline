package com.server.server.repository;


import com.server.server.models.WebhookLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WebhookLogRepo extends MongoRepository<WebhookLog, String> {
    List<WebhookLog> findByRepoFullNameOrderByTimestampDesc(String repoFullName);
}

