const express = require("express");
const db = require("./lib/mongodb.js");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to FriendsBooks-API");
});

const validation = require("./validation/tokenValidation.js");

const postsRouter = require("./routers/posts.js");
app.use("/posts", validation.validateIdToken, postsRouter);

const likesRouter = require("./routers/likes.js");
app.use("/likes", validation.validateIdToken, likesRouter);

const friendsRouter = require("./routers/friends.js");
app.use("/friends", validation.validateIdToken, friendsRouter);

const profileRouter = require("./routers/profile.js");
app.use("/profile", validation.validateIdToken, profileRouter);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
