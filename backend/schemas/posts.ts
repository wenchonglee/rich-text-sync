import { mongoose } from "../deps.ts";

export const postsSchema = new mongoose.Schema({
  content: { type: String, required: true },
});

export const users = mongoose.model("posts", postsSchema);
