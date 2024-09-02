const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes.js");
const { v2: cloudinary } = require("cloudinary");

const connectMongoDB = require("./db/connectMongoDB");
const cookieParser = require("cookie-parser");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
  connectMongoDB();
});
