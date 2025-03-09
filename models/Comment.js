import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
