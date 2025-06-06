package com.server.server.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "projects")
@Getter
@Setter
@AllArgsConstructor
public class ProjectModel {

  @Id
  private String id;
  private String name;
  private String repoName;

  // Store only the IDs of build logs
  private List<String> buildLogIds;

  public ProjectModel() {}
}
