import { mongoose, oak } from "./deps.ts";
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
