package com.server.server.models;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "owner")
public class Sender {

    @Id
    private String id;
    private String name;
    private String avatar_url;
    private String type;

}
