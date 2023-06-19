const admin = require("../lib/firebase-admin");

const validateIdToken = async (req, res, next) => {
  const authHeader = req.header("authorization");
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(403);

  admin
    .auth()
    .verifyIdToken(token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
};

module.exports = {
  validateIdToken: validateIdToken,
};
