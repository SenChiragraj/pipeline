package com.server.server.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({FileNotDeletedException.class})
    public ResponseEntity<Object> handleStudentNotFoundException(FileNotDeletedException exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }

    @ExceptionHandler({MergeException.class})
    public ResponseEntity<Object> handleMergeException(MergeException exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }

    @ExceptionHandler(InvalidPayloadException.class)
    public ResponseEntity<String> handleInvalidPayload(InvalidPayloadException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payload: " + ex.getMessage());
    }

    @ExceptionHandler(BuildTriggerException.class)
    public ResponseEntity<String> handleBuildTriggerError(BuildTriggerException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Build error: " + ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
    }

}
