package com.server.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.server.service.LogService;

@RestController
@RequestMapping("/api/logs")
public class LogController {

  @Autowired
  LogService logService;

  @GetMapping("/all")
  public ResponseEntity<?> getAllLogs() {
    return new ResponseEntity<>(logService.getAllLogs(), HttpStatus.OK);
  }

}
