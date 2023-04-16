package dev.wenchonglee.richtextsync.users;

import com.mongodb.client.ChangeStreamIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.changestream.FullDocument;
import dev.wenchonglee.richtextsync.posts.Post;
import dev.wenchonglee.richtextsync.posts.PostRepository;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.List;

import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class UserChangeStream {

    private final MongoDatabaseFactory factory;
    private final PostRepository postRepository;

    UserChangeStream(MongoDatabaseFactory factory, PostRepository postRepository){
        this.factory = factory;
        this.postRepository = postRepository;
        watchStream();
    }

    public void watchStream () {

        MongoDatabase db = factory.getMongoDatabase();
        MongoCollection<Document> mongoCollection = db.getCollection("users");

        List<Bson> pipeline = Arrays.asList(
                Aggregates.match(
                        Filters.in("operationType",
                                Arrays.asList("update", "replace"))));
        ChangeStreamIterable<Document> changeStream = mongoCollection.watch(pipeline)
                .fullDocument(FullDocument.UPDATE_LOOKUP);

        ExecutorService executorService = Executors.newSingleThreadExecutor();
        executorService.execute(()-> {
            changeStream.forEach(event -> {
                System.out.println("| Received a change to the collection: " + event.getFullDocument());
                ObjectId userId = (ObjectId) event.getFullDocument().get("_id");
                String username = (String) event.getFullDocument().get("username");
                List<Post> posts = postRepository.findByRefId(userId.toString());

                for(Post p :posts){
                    org.jsoup.nodes.Document document = Jsoup.parse(p.getContent(), "", Parser.xmlParser());
                    Elements mentionElements = document.select(String.format("span[data-id='%s']", userId.toString()));

                    for (Element element: mentionElements) {
                        element.text(username);
                        element.attr("data-label", username);
                    }
                    p.setContent(document.html());
                    postRepository.save(p);
                }

            });
        });
    }

}
