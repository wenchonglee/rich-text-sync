import { denoDom } from "./deps.ts";
import { Post } from "./schemas/posts.ts";
import { User } from "./schemas/users.ts";

//todo: pipeline filter to only update events
const changeStream = User.watch([], { fullDocument: "updateLookup" });

changeStream.on("change", (data) => {
  if (data.operationType !== "update") return;
  // console.log("received a change to the collection: \t", data.fullDocument);

  updatePost(data.fullDocument._id, data.fullDocument.username);
});

const updatePost = async (userId: string, username: string) => {
  for await (const post of Post.find({ "references.id": userId, "references.type": "mention" })) {
    try {
      const document = new denoDom.DOMParser().parseFromString(post.content, "text/html");
      if (!document) continue;

      const mentionNodes = document.querySelectorAll(`span[data-id='${userId}']`);

      for (const node of mentionNodes) {
        const element = node as denoDom.Element;
        element.innerText = username;
        element.setAttribute("data-label", username);
      }

      await Post.updateOne(
        {
          _id: post._id,
        },
        {
          $set: {
            content: document.documentElement?.innerHTML,
          },
        }
      );
    } catch {
      console.log("something went wrong");
    }
  }
};
