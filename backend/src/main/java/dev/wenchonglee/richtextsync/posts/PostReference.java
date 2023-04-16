package dev.wenchonglee.richtextsync.posts;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PostReference {

    String id;
    String type;
}
