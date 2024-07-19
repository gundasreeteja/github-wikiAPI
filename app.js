const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("articles", articleSchema);

app.get("/articles", async function (req, res) {
  await Article.find()
    .then(function (articlesFound) {
      res.send(articlesFound);
    })
    .catch(function (err) {
      res.send(err);
    });
});

app.post("/articles", async function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  await newArticle
    .save()
    .then(function (savedArticle) {
      res.send("New Article " + savedArticle.title + " is saved!");
    })
    .catch(function (err) {
      res.send(err);
    });
});

app.delete("/articles", async function (req, res) {
  await Article.deleteMany()
    .then(function () {
      res.send("Successfully deleted all articles.");
    })
    .catch(function (err) {
      res.send(err);
    });
});

app.listen(3000, function () {
  console.log("Server is running at port 3000.");
});
