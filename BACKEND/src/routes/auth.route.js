import { Router } from "express";

import {
  login,
  logout,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  initiateGoogleAuth,
  completeGoogleSignup,
  googleCallback,
} from "../controllers/auth.controller.js";

import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

import { validate } from "../middleware/validator.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validate, registerUser);

authRouter.route("/login").post(userLoginValidator(), validate, login);
authRouter.route("/refresh-token").post(refreshAccessToken);

//secure routes
authRouter.route("/logout").post(verifyJwt, logout);
authRouter.route("/getUser").get(verifyJwt, getCurrentUser);

// Endpoint that provides or redirects to the Google Consent URL
authRouter.route("/google").get(initiateGoogleAuth);

// Endpoint Google calls automatically after validation
authRouter.route("/google/callback").get(googleCallback);

// Final endpoint called by your client to save a chosen username
authRouter.route("/google/complete-signup").post(completeGoogleSignup);

export default authRouter;
