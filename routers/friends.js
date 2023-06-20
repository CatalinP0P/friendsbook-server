const express = require("express");
const db = require("../lib/mongodb");

const router = express.Router();

/*
Model
senderId
receiverId
*/

const requests = db.collection("Requests");
const friends = db.collection("Friends");

const checkIfFriends = async (user1, user2) => {
  const find1 = await friends.findOne({ user1: user1, user2: user2 });
  const find2 = await friends.findOne({ user1: user2, user2: user1 });

  if (find1 || find2) return true;

  return false;
};

router.get("/", async (req, res) => {
  const friendList = await friends
    .find({
      $or: [{ user1: req.user.uid }, { user2: req.user.uid }],
    })
    .toArray();

  var list = [];
  friendList.forEach((person) => {
    if (person.user1 != req.user.uid) list.push(person.user1);
    else list.push(person.user2);
  });

  res.send(list);
});

router.get("/requests", async (req, res) => {
  const response = await requests.find({ receiverId: req.user.uid }).toArray();
  var list = [];
  response.forEach((x) => {
    list.push(x.senderId);
  });

  res.send(list);
});

router.get("/:id", async (req, res) => {
  res.send(await checkIfFriends(req.user.uid, req.params.id));
});

router.post("/request/:userId", async (req, res) => {
  if (await checkIfFriends(req.params.userId, req.user.uid))
    return res.send("Already friends");

  const request = await requests.findOne({
    senderId: req.params.userId,
    receiverId: req.user.uid,
  });

  if (request) {
    // If the request has been made by the other person we accept it
    await requests.deleteOne({
      senderId: req.params.userId,
      receiverId: req.user.uid,
    });
    await friends.insertOne({ user1: req.params.userId, user2: req.user.uid });

    return res.send("Friend Request accepted");
  } else {
    // Checking if we already send a request, if we sent it, we will remove it now
    const x = await requests.findOne({
      senderId: req.user.uid,
      receiverId: req.params.userId,
    });

    if (x) {
      await requests.deleteOne({
        senderId: req.user.uid,
        receiverId: req.params.userId,
      });

      return res.send("Request removed");
    } else {
      await requests.insertOne({
        senderId: req.user.uid,
        receiverId: req.params.userId,
      });
    }
    return res.send("Request send");
  }
});

module.exports = router;
