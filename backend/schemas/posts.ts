import { mongoose } from "../deps.ts";

const referenceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
});

const postsSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    references: { type: [referenceSchema], required: true, _id: false },
  },
  {
    versionKey: false,
  }
);

export const Post = mongoose.model("posts", postsSchema);
