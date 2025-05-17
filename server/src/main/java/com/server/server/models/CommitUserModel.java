package com.server.server.models;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "commit_user")
public class CommitUserModel {

    @Id
    private String userId;
    private String name;
    private String username;
    private String email;

    public  CommitUserModel () {

    }

    public CommitUserModel(String name, String username, String email) {
        this.name = name;
        this.username = username;
        this.email = email;
    }
}
