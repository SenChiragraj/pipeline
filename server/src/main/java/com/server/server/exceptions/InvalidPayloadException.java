package com.server.server.exceptions;

public class InvalidPayloadException extends RuntimeException{
    public InvalidPayloadException (String m) {
        super(m);
    }
}
