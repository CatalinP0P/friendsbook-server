const express = require("express");
const db = require("../lib/mongodb");
const { ObjectId } = require("mongodb");

const router = express.Router();

const posts = db.collection("Posts");

router.post("/:postid", async (req, res) => {
  const post = await posts.findOne({ _id: new ObjectId(req.params.postid) });
  var likes = post.likes;

  try {
    var state = "liked";
    var liked = likes.filter((m) => m.userId == req.user.uid);
    if (liked.length > 0) {
      state = "unliked";
      likes = likes.filter((m) => m.userId != req.user.uid);
    } else {
      likes.push({ userId: req.user.uid });
    }

    posts.updateOne(
      { _id: new ObjectId(req.params.postid) },
      { $set: { likes: likes } }
    );

    res.send(state);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
