const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id/", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

module.exports = router;
