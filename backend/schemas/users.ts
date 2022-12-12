import { mongoose } from "../deps.ts";

export const usersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

usersSchema.index({ username: "text" });
export const User = mongoose.model("users", usersSchema);
