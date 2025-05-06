package com.server.server.repository;

import com.server.server.models.BuildLogs;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface BuildLogRepo extends MongoRepository<BuildLogs, String> {
    // Custom query methods can go here if needed
}

