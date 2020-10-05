const db = require("../../models");

exports.exists = (info) => {
  return info ? true : false;
};

exports.existingEmail = async (email) => {
  const results = await db.User.findOne({ email: email });
  return results !== null ? true : false;
};

exports.existingWebinar = async (title) => {
  const results = await db.Webinar.findOne({ title: title });
  return results !== null ? true : false;
};

// Not actually using Usernames right now, but in case we want to, let's keep it

// exports.existingUsername = async (username) => {
//     const results = await db.User.findOne({ username: username });
//     return (results !== null) ? true : false;
// }
