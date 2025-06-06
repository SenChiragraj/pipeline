package com.server.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.mongodb.client.MongoDatabase;
import com.server.server.models.ProjectModel;

public interface ProjectRepo extends MongoRepository<ProjectModel, String> {

}
