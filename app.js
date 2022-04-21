const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const user = require("./routes/user");
const auth = require("./routes/auth");
const article = require("./routes/article");
const { User } = require("./models/user");
const tags = require("./routes/tags");
const profile = require("./routes/profile");
const app = express();
//const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(auth);
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use(express.static(path.join(__dirname, "dist", "index.html")));
app.use(express.static("dist"));

app.use("/api/users", user);
// app.use("/api", user);
app.use("/api/articles", article);
app.use("/api/tags", tags);
app.use("/api", profile);

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Started Express server on port ${PORT}`);
});
//register - http://localhost:3000/api/users
//login - http://localhost:3000/api/users/login
//tags - http://localhost:3000/api/tags
//articles - http://localhost:3000/api/articles?limit=10&offset=0
