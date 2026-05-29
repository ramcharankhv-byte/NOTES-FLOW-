import { Note } from "../models/notes.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Workspace } from "../models/workspace.model.js";

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const isMember = workspace.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) {
    throw new ApiError(403, "Unauthorized: You must be a workspace member to create notes");
  }

  const note = await Note.create({
    title,
    content,
    workspace: workspaceId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getWorkspaceNotes = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");
  
  const isMember = workspace.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Unauthorized");

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const notes = await Note.find({
    workspace: workspaceId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const workspace = await Workspace.findById(note.workspace);
  const isMember = workspace?.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) {
    throw new ApiError(403, "Unauthorized: You must be a workspace member to update notes");
  }

  if (title) note.title = title;
  if (content) note.content = content;

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const workspace = await Workspace.findById(note.workspace);
  const isCreator = note.createdBy.toString() === req.user._id.toString();
  const isOwner = workspace?.owner.toString() === req.user._id.toString();

  if (!isCreator && !isOwner) {
    throw new ApiError(403, "Unauthorized: Only the creator or workspace owner can delete notes");
  }

  await note.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Notes deleted"));
});

const searchNotes = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { query } = req.query || "";

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const isMember = workspace.members.some(m => m.toString() === req.user._id.toString());
  if (!isMember) throw new ApiError(403, "Unauthorized");

  const notes = await Note.find({
    workspace: workspaceId,

    title: {
      $regex: query,
      $options: "i",
    },
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export { createNote, getWorkspaceNotes, updateNote, deleteNote, searchNotes };
