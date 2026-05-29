import { Workspace } from "../models/workspace.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createWorkspace = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name not found");
  }

  const workSpace = await Workspace.create({
    name: name,
    owner: req.user?._id,
    members: [req.user?._id],
  });

  const createdWorkSpace = await Workspace.findById(workSpace?._id)
    .populate("owner", "username email")
    .populate("members", "username email");

  if (!createdWorkSpace) {
    throw new ApiError("Workspace Not Found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { workspace: createdWorkSpace },
        "workspace created successfully",
      ),
    );
});

const getWorkSpace = asyncHandler(async (req, res) => {
  const workSpace = await Workspace.findById(req.params.workspaceId)
    .populate("owner", "username  email")
    .populate("members", "username email");

  return res
    .status(200)
    .json(new ApiResponse(200, { workSpace }, "workspace fetched"));
});

const addMember = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const workSpace = await Workspace.findOne({
    _id: workspaceId,
    owner: req.user._id,
  });

  if (!workSpace) {
    throw new ApiError(404, "workspace not found");
  }

  const { memberId } = req.body; // Frontend sends an email address here

  const userToAdd = await User.findOne({ email: memberId.toLowerCase().trim() });
  if (!userToAdd) {
    throw new ApiError(404, "No user found with this email address");
  }

  const memberExists = workSpace.members.some(
    (existingMember) => existingMember.toString() === userToAdd._id.toString(),
  );

  if (memberExists) {
    throw new ApiError(400, "Member already exists in this workspace");
  }

  workSpace.members.push(userToAdd._id);

  await workSpace.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Member added to workspace"));
});

const leaveWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const workSpace = await Workspace.findById(workspaceId);

  if (!workSpace) {
    throw new ApiError(404, "workspace not found");
  }

  const memberExists = workSpace.members.some(
    (existingMember) => existingMember.toString() === req.user._id.toString(),
  );

  if (!memberExists) {
    throw new ApiError(404, "Member not found in workspace");
  }

  if (workSpace.owner.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Owner cannot leave workspace");
  }

  workSpace.members.pull(req.user._id);

  await workSpace.save();

  return res.status(200).json(new ApiResponse(200, " workspace left"));
});

const removeMember = asyncHandler(async (req, res) => {
  const workSpace = await Workspace.findOne({
    _id: req.params.workspaceId,
    owner: req.user._id,
  });

  if (!workSpace) {
    throw new ApiError(404, "workspace not found");
  }

  const { member } = req.body;

  const memberExists = workSpace.members.some(
    (existingMember) => existingMember.toString() === member.toString(),
  );

  if (!memberExists) {
    throw new ApiError(404, "member does not exist");
  }

  if (workSpace.owner.toString() === member.toString()) {
    throw new ApiError(400, "Owner cannot be removed");
  }

  workSpace.members.pull(member);

  await workSpace.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Member removed from workspace"));
});

const deleteWorkSpace = asyncHandler(async (req, res) => {
  const workSpace = await Workspace.findOne({
    _id: req.params.workspaceId,
    owner: req.user._id,
  });

  if (!workSpace) {
    throw new ApiError(404, "workspace not found");
  }

  await workSpace.deleteOne();

  return res.status(200).json(new ApiResponse(200, "Workspace deleted"));
});

const getUserWorkspaces = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const workspaces = await Workspace.find({
    members: req.user._id,
  })
    .populate("owner", "username email")
    .populate("members", "username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

const searchWorkspaces = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const workspaces = await Workspace.find({
    members: req.user._id,

    name: {
      $regex: query,
      $options: "i",
    },
  })
    .populate("owner", "username email")
    .populate("members", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully"));
});

export {
  createWorkspace,
  getWorkSpace,
  addMember,
  leaveWorkspace,
  removeMember,
  deleteWorkSpace,
  getUserWorkspaces,
  searchWorkspaces,
};
