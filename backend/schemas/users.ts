import { mongoose } from "../deps.ts";

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

usersSchema.index({ username: "text" });
export const User = mongoose.model("users", usersSchema);
