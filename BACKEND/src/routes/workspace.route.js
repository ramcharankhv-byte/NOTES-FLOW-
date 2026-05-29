import { Router } from "express";

import {
  createWorkspace,
  getWorkSpace,
  addMember,
  leaveWorkspace,
  removeMember,
  deleteWorkSpace,
  getUserWorkspaces,
  searchWorkspaces,
} from "../controllers/workspace.controller.js";

import { validate } from "../middleware/validator.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

import {
  createWorkspaceValidator,
  addMemberValidator,
  removeMemberValidator,
} from "../validators/index.js";

const workspaceRouter = Router();

workspaceRouter
  .route("/")
  .post(verifyJwt, createWorkspaceValidator(), validate, createWorkspace);

workspaceRouter.route("/search").get(verifyJwt, searchWorkspaces);

workspaceRouter.route("/").get(verifyJwt, getUserWorkspaces);

workspaceRouter
  .route("/:workspaceId")
  .get(verifyJwt, getWorkSpace)
  .delete(verifyJwt, deleteWorkSpace);

workspaceRouter
  .route("/:workspaceId/add")
  .patch(verifyJwt, addMemberValidator(), validate, addMember);

workspaceRouter
  .route("/:workspaceId/remove")
  .patch(verifyJwt, removeMemberValidator(), validate, removeMember);

workspaceRouter.route("/:workspaceId/leave").patch(verifyJwt, leaveWorkspace);

export default workspaceRouter;
