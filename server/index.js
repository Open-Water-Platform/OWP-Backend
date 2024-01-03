require("dotenv").config();
var express = require("express");
var app = express();

const { deviceRoute } = require("./src/routes/device.route");

const PORT = process.env.PORT || 8000;

var cors = require("cors");
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("connection success!!");
});
app.use("/api/v1/device", deviceRoute);


app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
