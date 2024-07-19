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

app
  .route("/articles")
  .get(async function (req, res) {
    await Article.find()
      .then(function (articlesFound) {
        res.send(articlesFound);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(async function (req, res) {
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
  })
  .delete(async function (req, res) {
    await Article.deleteMany()
      .then(function () {
        res.send("Successfully deleted all articles.");
      })
      .catch(function (err) {
        res.send(err);
      });
  });

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    await Article.findOne({ title: req.params.articleTitle })
      .then(function (articleFound) {
        if (articleFound != null) {
          res.send(articleFound);
        } else {
          res.send("No matching article found");
        }
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .put(async function (req, res) {
    await Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    )
      .then(function (updatedArticle) {
        if (updatedArticle.matchedCount != 0) {
          res.send("Successfully updated the article");
        } else {
          res.status(404).send("No matching article found");
        }
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  })
  .patch(async function (req, res) {
    await Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
      .then(function (updatedArticle) {
        // console.log(updatedArticle);
        if (updatedArticle.matchedCount != 0) {
          res.send("Successfully updated the article");
        } else {
          res.status(404).send("No matching article found");
        }
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  })
  .delete(async function (req, res) {
    await Article.deleteOne({ title: req.params.articleTitle })
      .then(function (deletedArticle) {
        if (deletedArticle.deletedCount != 0) {
          res.send("Article deleted successfully");
        } else {
          res.status(404).send("No matching record found");
        }
      })
      .catch(function (err) {
        res.status(500).send(err);
      });
  });

app.listen(3000, function () {
  console.log("Server is running at port 3000.");
});
