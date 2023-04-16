package dev.wenchonglee.richtextsync.posts;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    @Query("{ 'references.id' : ?0, 'references.type': 'mention' }")
    List<Post> findByRefId(String id);
}
