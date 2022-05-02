const userAuth = require("./functions/UserAuth.js");
const db = require("../models");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// CREATE USER

exports.create = async (req, res) => {
  try {
    let {
      firstname,
      lastname,
      email,
      password,
      passwordCheck,
      displayname,
      role,
      favorite,
      registered,
      completedVideo,
      passedQuiz,
    } = req.body;

    console.log("Is this a password?:" + password);
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification" });

    console.log("Is this an email?:" + email);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    if (await userAuth.existingEmail(email)) {
      return res
        .status(409)
        .json({
          success: false,
          error: "An account with this email address already exists",
        })
        .end();
    }

    if (!displayname) displayname = email;

    const User = new db.User({
      firstname,
      lastname,
      email,
      displayname,
      password: passwordHash,
      role,
      favorite,
      registered,
      completedVideo,
      passedQuiz,
    });
    const savedUser = await User.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// LOGIN USER

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered" });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER

exports.delete = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK IF VALID TOKEN

exports.validate = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER BY TOKEN
exports.getToken = async (req, res) => {
  const user = await User.findById(req.user);
  console.log(JSON.stringify(user));
  // Why does commenting this out fix CORS problem?
  // Why do we need this function in the first place?
  // Clear browser storage and see how the app functions
  // res.json({
  //   token,
  //   user: user,
  // });
};

exports.update = async (req, res) => {
  // console.log("howdy!");
  const { body } = req;
  console.log(req.body);
  if (!userAuth.exists(body)) {
    return res
      .status(400)
      .json({ success: false, error: "No body or null body received." })
      .end();
  }
  const User = new db.User(body);
  if (!userAuth.exists(User)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "You must provide all the required information for the form!",
      })
      .end();
  }

  let test;
  db.User.findOne({ _id: req.body.id }, (err, user) => {
    if (user.favorite.includes(req.body.favorite)) {
      console.log("REMOVE THAT SUCKER!");
      db.User.updateOne(
        { _id: req.body.id },
        { $pull: { favorite: req.body.favorite } },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            console.log(success);
            return res.status(200).json({ success: true, data: User }).end();
          }
        }
      );
    } else {
      console.log("ADD THAT SUCKER!");
      db.User.updateOne(
        { _id: req.body.id },
        { $addToSet: { favorite: req.body.favorite } },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            console.log(success);
            return res.status(200).json({ success: true, data: User }).end();
          }
        }
      );
    }
  });
};

// DELETE USER

// exports.delete = async (req, res) => {
//   await db.User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err }).end();
//     }

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, error: `User not found` })
//         .end();
//     }

//     return res
//       .status(200)
//       .json({
//         success: true,
//         message: "This User was successfully deleted!",
//         data: user,
//       })
//       .end();
//   }).catch((err) => console.log(err));
// };

// Get User By ID

exports.getId = async (req, res) => {
  await db.User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err }).end();
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: `User not found` })
        .end();
    }
    return res.status(200).json({ success: true, data: user }).end();
  }).catch((err) => console.log(err));
};

// Get All Users

exports.getAll = async (req, res) => {
  await db.User.find({}, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err }).end();
    }
    if (!user.length) {
      return res
        .status(404)
        .json({ success: false, error: `Users not found` })
        .end();
    }
    return res.status(200).json({ success: true, data: user }).end();
  }).catch((err) => console.log(err));
};

// Verify User

exports.verifyUser = async (req, res) => {
  // if (!userAuth.exists(body)) {
  //     return res.status(400).json({ success: false, error: "No body or null body received." }).end()
  // }
  // const User = new db.User(body);
  // if (!userAuth.exists(User)) {
  //     return res.status(400).json({
  //         success: false,
  //         error: 'You must provide all the required information for the form!'
  //     }).end()
  // }
  // Try later with req.data instead of params or body
  await db.User.findOne(
    { email: req.params.email, password: req.params.password },
    (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err }).end();
      }

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: `User not found` })
          .end();
      }
      return res.status(200).json({ success: true, data: user }).end();
    }
  ).catch((err) => console.log(err));
};

// Get User Favorite

exports.getUserFavorite = async (req, res) => {
  await db.User.findOne({ _id: req.params.id })
    .populate("favorite")
    .then((userFavoriteWebinar, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err }).end();
      }
      if (!userFavoriteWebinar) {
        return res
          .status(404)
          .json({ success: false, error: `User's favorite webinars not found` })
          .end();
      }
      return res
        .status(200)
        .json({ success: true, data: userFavoriteWebinar })
        .end();
    })
    .catch((err) => console.log(err));
};

exports.getUserRegistered = async (req, res) => {
  await db.User.findOne({ _id: req.params.id })
    .populate("registered")
    .then((userRegisteredWebinar, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err }).end();
      }
      if (!userRegisteredWebinar) {
        return res
          .status(404)
          .json({
            success: false,
            error: `User's registered webinars not found`,
          })
          .end();
      }
      return res
        .status(200)
        .json({ success: true, data: userRegisteredWebinar })
        .end();
    })
    .catch((err) => console.log(err));
};

// Get User Completed Videos

exports.getUserCompleted = async (req, res) => {
  await db.User.findOne({ _id: req.params.id })
    .populate("completedVideo")
    .then((userCompletedWebinar, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err }).end();
      }
      if (!userCompletedWebinar) {
        return res
          .status(404)
          .json({
            success: false,
            error: `User's completed webinars not found`,
          })
          .end();
      }
      return res
        .status(200)
        .json({ success: true, data: userCompletedWebinar })
        .end();
    })
    .catch((err) => console.log(err));
};

// Get User Passed Quizzes

exports.getUserPassed = async (req, res) => {
  await db.User.findOne({ _id: req.params.id })
    .populate("passedQuiz")
    .then((userPassedWebinar, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err }).end();
      }
      if (!userPassedWebinar) {
        return res
          .status(404)
          .json({ success: false, error: `User's passed quizes not found` })
          .end();
      }
      return res
        .status(200)
        .json({ success: true, data: userPassedWebinar })
        .end();
    })
    .catch((err) => console.log(err));
};
