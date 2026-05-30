import { asyncHandler } from "../utils/asynchandler.js";
import { OAuth2Client } from "google-auth-library";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // console.log("access token : ", accessToken);
    // console.log("refresh token: ", refreshToken);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Unknown Error Occured while creating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (await User.findOne({ $or: [{ email: email }, { username: username }] })) {
    throw new ApiError(409, "user already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  await user.save();

  // Generate tokens after user creation
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken },
        "User created and logged in successfully",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isPasswordValid = await user.isPassCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "wrong password entered");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
      user._id,
    );

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password  -refreshtoken",
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(202)
      .json(
        new ApiResponse(
          202,
          { user: loggedInUser, accessToken },
          "user logged in successfully",
        ),
      );
  } catch (err) {
    console.log(err);
  }
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // console.log("cookie: ", req.cookies);
  // console.log("cookie-header: ", req.headers.cookie);

  const incomingToken = req.cookies.refreshToken;

  // console.log("incoming token : ", incomingToken);

  if (!incomingToken) {
    throw new ApiError(404, "No refresh token found please relogin");
  }

  const decodedToken = await jwt.verify(incomingToken, process.env.JWT_SECRET);

  // console.log("decoded token :", decodedToken);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Token");
  }

  if (incomingToken !== user?.refreshToken) {
    throw new ApiError(401, "No Token Found in DATABASE");
  }

  const options = {
    httpOnly: true,
    secure: false,
  };

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  user.refreshToken = refreshToken;

  await user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken: refreshToken,
          accessToken: accessToken,
        },
        "Tokens Refreshed",
      ),
    );
  //  catch (err) {
  //   throw new ApiError(500, "error creating refresh token");
  //   console.log(err);
  // }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password  -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token =
    req.cookies?.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: user, accessToken: token },
        "Current user fetched succesfully",
      ),
    );
});

/**
 * @desc    Step 1: Initiate Google OAuth Flow
 * @route   GET /api/v1/auth/google
 */

const initiateGoogleAuth = asyncHandler(async (req, res) => {
  // Create client inside function to ensure env vars are loaded
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  // If using EJS/SSR directly: return res.redirect(url);
  // If using separate Frontend:
  return res
    .status(200)
    .json(new ApiResponse(200, { url }, "Google URL generated"));
});

/**
 * @desc    Step 2: Google Redirect Callback (Handles split Login vs Username Signup logic)
 * @route   GET /api/v1/auth/google/callback
 */

const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new ApiError(400, "Authorization code missing from Google redirect");
  }

  try {
    // Create client inside function to ensure env vars are loaded
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    // Exchange auth code for profile tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const { sub: googleId, email } = userInfoResponse.data;

    if (!email) {
      throw new ApiError(400, "Email profile data not provided by Google");
    }

    // Look for existing user profile
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // --- CASE A: USER LOGINS DIRECTLY ---
    if (user) {
      // If they previously registered via normal email/password, link Google ID now
      if (!user.googleId) {
        user.googleId = googleId;
      }

      const { accessToken, refreshToken } =
        await generateAccessandRefreshTokens(user._id);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // Set cookies and redirect with success
      res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions);

      // Redirect to callback page with success query param
      return res.redirect(`${frontendUrl}/auth/callback?auth=success`);
    }

    // --- CASE B: NEW USER SIGNUP (Requires Username Step) ---
    // Store Google data inside a secure, short-lived 15-minute token
    const tempSignupToken = jwt.sign(
      { email, googleId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Redirect to username setting page on the frontend with the token in query params
    return res.redirect(
      `${frontendUrl}/auth/complete-signup?token=${tempSignupToken}`,
    );
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    console.error("Google callback error:", error);
    return res.redirect(`${frontendUrl}/auth/login?error=google_auth_failed`);
  }
});

/**
 * @desc    Step 3: Complete Signup by validating unique username
 * @route   POST /api/v1/auth/google/complete-signup
 */
const completeGoogleSignup = asyncHandler(async (req, res) => {
  const { username, token } = req.body;

  if (!username || !token) {
    throw new ApiError(400, "Username and signup token are required");
  }

  const cleanUsername = username.toLowerCase().trim();

  // 1. Verify the temporary registration token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(
      400,
      "Signup session has expired. Please log in with Google again.",
    );
  }

  const { email, googleId } = decoded;

  // 2. Enforce structural username uniqueness check
  const usernameTaken = await User.findOne({ username: cleanUsername });
  if (usernameTaken) {
    throw new ApiError(409, "This username is already taken. Try another one.");
  }

  // Safe-guard double check against email collision
  const emailTaken = await User.findOne({ email });
  if (emailTaken) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // 3. Create permanent database user profile
  const user = await User.create({
    username: cleanUsername,
    email,
    googleId,
    // password remains unpopulated for pure OAuth accounts
  });

  // 4. Issue credentials and login instantly
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: loggedInUser, accessToken },
        "Account created and authenticated successfully!",
      ),
    );
});

export {
  login,
  logout,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  initiateGoogleAuth,
  completeGoogleSignup,
  googleCallback,
};
