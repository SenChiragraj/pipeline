package com.server.server.repository;

import com.server.server.models.Sender;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SenderRepo extends MongoRepository<Sender, String> {
}
