import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "pending"],
    default: "pending",
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Task = mongoose.model("Task", taskSchema);
