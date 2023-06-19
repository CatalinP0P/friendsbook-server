const { ObjectId } = require("mongodb");
const db = require("../lib/mongodb");
const express = require("express");

const router = express.Router();
const posts = db.collection("Posts");

router.get("/", async (req, res) => {
  const docs = await posts.find({}).sort({ _id: -1 }).limit(50).toArray();
  res.json(docs);
});

router.get("/:postid", async (req, res) => {
  const post = await posts.findOne({ _id: new ObjectId(req.params.postid) });
  return post;
});

router.get("/profile/:id", async (req, res) => {
  console.log(req.params.id);
  const response = await posts
    .find({ userId: req.params.id })
    .sort({ _id: -1 })
    .toArray();
  res.send(response);
});

router.post("/", async (req, res) => {
  const { title, photoURL } = req.body;

  if (!title) return res.sendStatus(400);
  const response = await posts.insertOne({
    userId: req.user.uid,
    userDisplayName: req.user.name,
    userPhoto: req.user.picture,
    title: title,
    photoURL: photoURL,
    likes: [],
  });

  res.send(response);
});

module.exports = router;
