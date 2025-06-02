package com.server.server.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.BufferedReader;

@Getter
@Setter
@AllArgsConstructor
public class PipeLineResponse {
    String message;
    boolean success;


}
