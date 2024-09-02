const { Notification } = require("../models/notification.model");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { v2: cloudinary } = require("cloudinary");

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if either text or image is provided
    if (!text && !img) {
      return res
        .status(400)
        .json({ message: "Please provide either text or an image" });
    }

    // Upload image to Cloudinary if provided
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // Create a new post
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    // Save the post
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error in deletePost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const commenOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Please provide a comment" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in commenOnPost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post Unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post Liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createPost, deletePost, commenOnPost, likeUnlikePost };
