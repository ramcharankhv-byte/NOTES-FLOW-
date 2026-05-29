import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    require: true,
  },
});

export const Note = mongoose.model("Note", noteSchema);
