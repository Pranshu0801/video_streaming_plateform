import { Router } from "express";
import { registerRoute } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multter.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerRoute
);

export default router;
