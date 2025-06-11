import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    enum: ["bar", "ara"],
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const DiaryEntrySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    enum: ["bar", "ara"],
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.DiaryEntry || mongoose.model("DiaryEntry", DiaryEntrySchema)
