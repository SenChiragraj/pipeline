package com.server.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.server.models.BuildLogs;
import com.server.server.repository.BuildLogRepo;

@Service
public class LogService {

  @Autowired
  private BuildLogRepo buildLogRepo;

  public Optional<List<BuildLogs>> getAllLogs() {
    return Optional.of(buildLogRepo.findAll());
  }

}
