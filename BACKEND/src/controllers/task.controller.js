import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Task } from "../models/task.model.js";
import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, assignedTo } = req.body;
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the workspace owner can create tasks");
  }

  const assignedUser = await User.findById(assignedTo);

  if (!assignedUser) {
    throw new ApiError(404, "Assigned user not found");
  }

  const isMember = workspace.members.includes(assignedTo);

  if (!isMember) {
    throw new ApiError(400, "User is not part of workspace");
  }

  const task = await Task.create({
    title: title,
    status: "pending",
    workspace: workspaceId,
    assignedTo: assignedTo,
    assignedBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task assigned successfully"));
});

const getWorkspaceTasks = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const isOwner = workspace.owner.toString() === req.user._id.toString();

  const query = { workspace: workspaceId };
  if (!isOwner) {
    query.assignedTo = req.user._id;
  }

  const task = await Task.find(query)
    .sort({ createdAt: -1 })
    .populate("assignedTo", "username email");

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const allowedStatuses = ["pending", "in-progress", "completed"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const workspace = await Workspace.findById(task.workspace);
  const isOwner = workspace.owner.toString() === req.user._id.toString();
  const isAssignee = task.assignedTo.toString() === req.user._id.toString();
  if (!isOwner && !isAssignee) {
    throw new ApiError(403, "Only the workspace owner or the assigned user can update this task");
  }

  task.status = status;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const assignTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const workspace = await Workspace.findById(task.workspace);

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the workspace owner can reassign tasks");
  }

  const user = await User.findById(assignedTo);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  task.assignedTo = assignedTo;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task assigned successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const workspace = await Workspace.findById(task.workspace);

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the workspace owner can delete tasks");
  }

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export {
  createTask,
  getWorkspaceTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
