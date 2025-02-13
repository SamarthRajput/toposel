const express = require("express");
const app = express();

// creating a userRouter all the request coming to /api/v1/user will be handled by this router
const userRouter = require("./user");
const router = express.Router();
router.use("/user", userRouter);

module.exports = router;