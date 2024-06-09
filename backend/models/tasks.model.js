const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  status: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
  }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);
