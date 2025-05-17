package com.server.server.repository;

import com.server.server.models.CommitInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommitInfoRepo extends MongoRepository<CommitInfo, String> {
}
