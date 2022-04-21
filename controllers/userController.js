const jwt = require("jsonwebtoken");
const { User, updateProfile } = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;
exports.verify = (req, res, next) => {

    if(req.user){
        next()
    }else {
      res.sendStatus(401)  
    }
}
exports.user_login = async function(req, res, next) {
        const {email, password} = req.body.user
        const userLogin = await User.login(email, password)
        if(userLogin){
          const userId = userLogin._id.toString()
          const token = jwt.sign({ 
            userId, username: userLogin.username
          },
          JWT_SECRET,
          {
            expiresIn: "24 days", subject: userId
          })
          const user = await User.findOneAndUpdate({email}, {token: token}, {new: true}).select({"password": false})
          res.json({user})
        }else {
          res.sendStatus(401)
        }
}


exports.user_update = async function (req, res, next) {
  const { userId } = req.user;
  const userInfo = ({ username, email, password, bio, image, token } =
    req.body.user);
  const user = await updateProfile(userInfo, userId);
  res.json({ user });
};
exports.create_user = async function (req, res, next) {
  const { username, password, email } = req.body.user;
  const user = new User({ username, password, email });
  await user.save();
  res.json(req.body);
};

exports.getUser = async function (req, res, next) {
  const { username } = req.user;
  const user = await User.findOne({username: username}).select({"password": false});
  res.json({user});
};

// @desc   Get user profile
// @route  GET /profiles/:username
// @access Authorization
exports.getUserProfile = async function (req, res, next) {
  //console.log(req.user);
  if (req.user) {
    const username = req.params.username;
    const user = await User.findOne({username: username});
    console.log("getUserProfile:", user);
    res.json(user);
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};