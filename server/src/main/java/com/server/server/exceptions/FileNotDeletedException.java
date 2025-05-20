package com.server.server.exceptions;


public class FileNotDeletedException extends RuntimeException {
    public FileNotDeletedException(String message){
        super(message);
    }
}
