const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: "First Name is a required field",
    trim: true,
  },
  lastname: {
    type: String,
    required: "Last Name is a required field",
    trim: true,
  },
  email: {
    type: String,
    required: "E-mail is a required field",
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
  },
  displayname: {
    type: String,
  },
  password: {
    type: String,
    required: "Password is a required field",
    trim: true,
    validate: [({ length }) => length >= 8, "Password should be longer."],
  },
  role: { type: String, required: true, enum: ["Virtuoso", "Prodigy"] },
  favorite: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
    },
  ],
  registered: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
    },
  ],
  completedVideo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
    },
  ],
  passedQuiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinar",
    },
  ],
  userCreated: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
