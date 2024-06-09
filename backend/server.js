const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/tasks", require("./routes/tasks.route"));

mongoose
  .connect("mongodb+srv://Vijay7604:12563423@tasks.rlpirkd.mongodb.net/?retryWrites=true&w=majority&appName=tasks")
  .then(() => {
    app.listen(5000, () => {
      console.log("Listening on port 5000");
      console.log("DB name:", mongoose.connection.db.databaseName);
    });
  })
  .catch((err) => {
    console.log(err);
  });
