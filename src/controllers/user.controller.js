import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerRoute = asyncHandler(async (req, res) => {
  // get user image from frontend
  // validation- not empty
  // check if user already exist- email, username
  // check for image check for avatar
  // upload them to cloudnary, avatar
  // create user object- create entry in db
  // remove password and refresh token field from response
  // check for user creattion
  // return res

  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // coverImage is not required field so we using this logic to handle this
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloundinary(avatarLocalPath);

  const coverImage = await uploadOnCloundinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { registerRoute };
