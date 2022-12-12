import { denoDom, mongoose, oak } from "./deps.ts";
import { Post } from "./schemas/posts.ts";
import { User } from "./schemas/users.ts";

export const router = new oak.Router({
  prefix: "/api",
});

router
  .get("/users", async (ctx) => {
    const queryString = oak.helpers.getQuery(ctx);

    const results = await User.find({
      username: new RegExp(queryString.username),
    })
      .lean()
      .exec();

    ctx.response.body = results;
  })
  .get("/users/:userId", async (ctx) => {
    const results = await User.findOne({
      _id: ctx.params.userId,
    })
      .lean()
      .exec();

    ctx.response.body = results;
  })
  .post("/users", async (ctx) => {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    try {
      const newUser = new User(requestBody);
      const document = await newUser.save();
      ctx.response.body = document.toObject();
      ctx.response.status = 201;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        ctx.response.body = "Invalid payload";
        ctx.response.status = 400;
        return;
      }

      ctx.response.body = error;
      ctx.response.status = 500;
    }
  })
  .put("/users/:userId", async (ctx) => {
    const requestBody = await ctx.request.body({ type: "json" }).value;

    try {
      await User.updateOne(
        {
          _id: ctx.params.userId,
        },
        requestBody,
        {
          runValidators: true,
        }
      );
      ctx.response.status = 200;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        ctx.response.body = "Invalid payload";
        ctx.response.status = 400;
        return;
      }

      ctx.response.body = error;
      ctx.response.status = 500;
    }
  })
  .delete("/users/:userId", async (ctx) => {
    try {
      await User.deleteOne({
        _id: ctx.params.userId,
      }).exec();

      ctx.response.body = "Record deleted";
    } catch (error) {
      ctx.response.body = error;
      ctx.response.status = 400;
    }
  });

router
  .get("/posts", async (ctx) => {
    const results = await Post.find().lean().exec();

    ctx.response.body = results;
  })
  .get("/posts/:postId", async (ctx) => {
    const results = await Post.findOne({
      _id: ctx.params.postId,
    })
      .lean()
      .exec();

    ctx.response.body = results;
  })
  .post("/posts", async (ctx) => {
    const requestBody = await ctx.request.body({ type: "json" }).value;

    const document = new denoDom.DOMParser().parseFromString(requestBody.content, "text/html");
    if (!document) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid payload";
      return;
    }

    const mentionNodes = document.querySelectorAll("span[data-type='mention']");

    const references: { type: string; id: string }[] = [];
    for (const node of mentionNodes) {
      const element = node as denoDom.Element;
      // element.innerText = "xd";
      const type = element.getAttribute("data-type");
      const id = element.getAttribute("data-id");
      if (type && id) {
        references.push({ type, id });
      }
    }

    try {
      const newPost = new Post({
        content: requestBody.content,
        references,
      });
      const document = await newPost.save();
      ctx.response.body = document.toObject();
      ctx.response.status = 201;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        ctx.response.body = "Invalid payload";
        ctx.response.status = 400;
        return;
      }

      ctx.response.body = error;
      ctx.response.status = 500;
    }
  });
