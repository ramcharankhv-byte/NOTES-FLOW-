import mongoose, { Schema } from "mongoose";

const workSpaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Workspace = mongoose.model("Workspace", workSpaceSchema);
