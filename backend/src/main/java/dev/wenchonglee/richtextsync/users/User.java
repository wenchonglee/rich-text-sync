package dev.wenchonglee.richtextsync.users;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection="users")
public class User {

    @Id
    String id;
    String username;
}
