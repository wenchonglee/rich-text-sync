package dev.wenchonglee.richtextsync.posts;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Unwrapped;

import java.util.List;

@Data
@Document(collection="posts")
public class Post {

    @Id
    String id;

    String content;

    List<PostReference> references;
}
