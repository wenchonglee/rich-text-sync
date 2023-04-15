package dev.wenchonglee.richtextsync.posts;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("")
    public List<Post> getAllPosts(){
        return postService.getAllPosts();
    }

    @GetMapping("/{postId}")
    public Optional<Post> getPost(@PathVariable String postId){
        return postService.getPost(postId);
    }

    @PostMapping("")
    public Post createPost(@RequestBody Post post){
        return postService.savePost(post);
    }
}
