require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

// (Old) Mlab + MongoDb Connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// (New) Mongo Atlas + MongoDb Connection
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB Connection Established");
  }
);

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
