const express = require("express");
const db = require("../lib/mongodb");
const admin = require("../lib/firebase-admin");

const router = express.Router();
const auth = admin.auth();

router.get("/:id", async (req, res) => {
  try {
    const user = await auth.getUser(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
