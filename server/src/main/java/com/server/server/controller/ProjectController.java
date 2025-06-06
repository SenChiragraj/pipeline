package com.server.server.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.server.models.ProjectModel;
import com.server.server.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

  @Autowired
  private ProjectService projectService;

  @GetMapping("/all")
  public CompletableFuture<ResponseEntity<List<ProjectModel>>> getAllProjects() {
    return projectService.getAllProjects()
        .thenApply(ResponseEntity::ok);
  }

  @PostMapping("/new")
  public CompletableFuture<ResponseEntity<ProjectModel>> createProject(
      @RequestParam String name,
      @RequestParam String repoName) {
    return projectService.createProject(name, repoName)
        .thenApply(ResponseEntity::ok);
  }

  @GetMapping("/get/{id}")
  public CompletableFuture<ResponseEntity<ProjectModel>> getProjectById(@PathVariable String id) {
    return projectService.getProjectById(id)
        .thenApply(project -> {
          if (project != null) return ResponseEntity.ok(project);
          else return ResponseEntity.notFound().build();
        });
  }
}

