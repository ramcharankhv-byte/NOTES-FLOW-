import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be of lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};
const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const createNoteValidator = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content required"),
  ];
};
const updateNoteValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty"),
  ];
};

const createWorkspaceValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Workspace name is required")
      .isLength({ min: 3 })
      .withMessage("Workspace name must be atleast 3 characters long"),
  ];
};

const addMemberValidator = () => {
  return [
    body("memberId")
      .trim()
      .notEmpty()
      .withMessage("Member email is required")
      .isEmail()
      .withMessage("Invalid member email"),
  ];
};

const removeMemberValidator = () => {
  return [
    body("member")
      .trim()
      .notEmpty()
      .withMessage("Member id is required")
      .isMongoId()
      .withMessage("Invalid member id"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ min: 3 })
      .withMessage("Task title must be atleast 3 characters long"),

    body("assignedTo")
      .trim()
      .notEmpty()
      .withMessage("Assigned user is required")
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};

const updateTaskStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid task status"),
  ];
};

const assignTaskValidator = () => {
  return [
    body("assignedTo")
      .trim()
      .notEmpty()
      .withMessage("Assigned user is required")
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  createNoteValidator,
  updateNoteValidator,
  createWorkspaceValidator,
  addMemberValidator,
  removeMemberValidator,
  createTaskValidator,
  updateTaskStatusValidator,
  assignTaskValidator,
};
