const express = require("express");
const { user_login, user_update, verify, create_user, getUser } = require("../controllers/userController");
const router = express.Router()
router.post("/users/login", user_login)
router.put("/user", verify, user_update)
router.post("/users", create_user)
router.get("/user", verify, getUser)
module.exports = router