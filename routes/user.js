const express = require("express");
const { user_login, user_update, verify, create_user, getUser } = require("../controllers/userController");
const router = express.Router()
router.post("/login", user_login)
router.put("/", verify, user_update)
router.post("/", create_user)
router.get("/", verify, getUser)
module.exports = router