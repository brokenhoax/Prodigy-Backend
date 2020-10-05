const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebinarSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, maxlength: 500 },
  date: {
    timezone: String,
    date: String,
    duration: Number,
    event: {
      title: String,
      start: String,
      end: String,
    },
  },
  hosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  mainTopic: {
    type: String,
    required: "Your Webinar needs a Main Topic",
    enum: ["JavaScript", "Python", "Angular", "React", "Node JS", "MongoDB"],
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  video: {
    url: String,
    title: String,
    description: String,
    viewed_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  quiz: {
    directions: String,
    questions: [
      {
        question: {
          body: String,
          choices: [
            {
              choice: String,
            },
          ],
          answer: String,
        },
      },
    ],
  },
  tags: {
    introduction: Boolean,
    lecture: Boolean,
    lab: Boolean,
    review: Boolean,
    bonus: Boolean,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Webinar = mongoose.model("Webinar", WebinarSchema);

module.exports = Webinar;
