
package com.server.server.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.server.server.models.ProjectModel;
import com.server.server.repository.ProjectRepo;

@Service
public class ProjectService {

  @Autowired
  private ProjectRepo projectRepo;

  @Async
  public CompletableFuture<List<ProjectModel>> getAllProjects() {
    return CompletableFuture.completedFuture(projectRepo.findAll());
  }

  @Async
  public CompletableFuture<ProjectModel> createProject(String name, String repoName) {
    ProjectModel project = new ProjectModel();
    project.setName(name);
    project.setRepoName(repoName);
    return CompletableFuture.completedFuture(projectRepo.save(project));
  }

  @Async
  public CompletableFuture<ProjectModel> getProjectById(String id) {
    return CompletableFuture.completedFuture(projectRepo.findById(id).orElse(null));
  }

  @Async
  public CompletableFuture<Void> deleteProject(String id) {
    projectRepo.deleteById(id);
    return CompletableFuture.completedFuture(null);
  }

  @Async
  public CompletableFuture<ProjectModel> updateProject(String id, String name) {
    ProjectModel project = projectRepo.findById(id).orElse(null);
    if (project != null) {
      project.setName(name);
      return CompletableFuture.completedFuture(projectRepo.save(project));
    }
    return CompletableFuture.completedFuture(null);
  }
}
