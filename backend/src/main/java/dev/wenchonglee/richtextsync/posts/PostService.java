package dev.wenchonglee.richtextsync.posts;

import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<Post> getAllPosts(){
        return postRepository.findAll();
    }

    public Optional<Post> getPost(String postId){
        return postRepository.findById(postId);
    }

    public Post savePost(Post post){
        Document document = Jsoup.parse(post.content);
        Elements mentionElements = document.select("span[data-type='mention']");

        List<PostReference> postReferences = new ArrayList<>();
        for (Element element: mentionElements){
            String type = element.attr("data-type");
            String id = element.attr("data-id");

            if(id.equals("")){
                throw new IllegalArgumentException("data-id is empty for a mention node");
            }

            postReferences.add(PostReference.builder()
                    .id(id)
                    .type(type)
                    .build());
        }
        post.setReferences(postReferences);
        System.out.println(post);

        return postRepository.save(post);
    }
}
