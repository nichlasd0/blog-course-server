const { request } = require("express");
const { defaultOptions } = require("mariadb");
const Sequelize = require("sequelize");
const crypto = require("crypto");

const sequelize = new Sequelize("blogcourse", "root", "123456", {
  host: "localhost",
  dialect: "mariadb",
  port: 3308,
});
const User = sequelize.define("user", {
  name: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  salt: { type: Sequelize.STRING, allowNull: false },
});

const Article = sequelize.define("article", {
  title: { type: Sequelize.STRING },
  key: { type: Sequelize.STRING },
  date: { type: Sequelize.DATE },
  content: { type: Sequelize.TEXT },
  description: { type: Sequelize.TEXT },
  imageUrl: { type: Sequelize.STRING },
  viewCount: { type: Sequelize.INTEGER },
  published: { type: Sequelize.BOOLEAN },
});

init = function () {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has ben esablised successfully");
    })
    .catch((err) => {
      console.error("Unable to connect to the database: ", err);
    });

  Article.sync({ force: true }).then(() => {
    Article.create({
      title: "My first article",
      content:
        "<p>Every day is taco ipsum tuesday. Say taco one more time. I think I’ve overdosed on tacos. How bout a gosh darn quesadilla? How bout a gosh darn quesadilla? BARBACOA!! Black or pinto beans? Tacos Al pastor/De Adobada are made of thin pork steaks seasoned with adobo seasoning, then skewered and overlapped on one another on a vertical rotisserie cooked and flame-broiled as it spins. How do you feel about hard shelled tacos? 50 cent tacos! I’ll take 30. Flour or corn tortillas? Let’s do a beef and a chicken, and one with both.</p> <p>Fish tacos with cabbage slaw and a side of chips and guac. Shrimp tacos are tasty tacos! Tacos dorados called flautas, or taquitos, for which the tortillas are filled with pre-cooked shredded chicken, beef or barbacoa, rolled into an elongated cylinder and deep-fried until crisp. Does guac cost extra? It’s taco time all the time. These tacos are lit. Fish tacos: lettuce or cabbage, pico de gallo, avocado and a sour cream or citrus/mayonnaise sauce, all placed on top of a corn or flour tortilla. How bout a gosh darn quesadilla?</p>",
      description: "This is my first article",
      key: "my-first-article",
      date: new Date(),
      imageUrl: "https://angular.io/assets/images/logos/angular/angular.png",
      published: true,
    });
    Article.create({
      title: "My second article",
      content:
        "<p>Every day is taco ipsum tuesday. Say taco one more time. I think I’ve overdosed on tacos. How bout a gosh darn quesadilla? How bout a gosh darn quesadilla? BARBACOA!! Black or pinto beans? Tacos Al pastor/De Adobada are made of thin pork steaks seasoned with adobo seasoning, then skewered and overlapped on one another on a vertical rotisserie cooked and flame-broiled as it spins. How do you feel about hard shelled tacos? 50 cent tacos! I’ll take 30. Flour or corn tortillas? Let’s do a beef and a chicken, and one with both.</p> <p>Fish tacos with cabbage slaw and a side of chips and guac. Shrimp tacos are tasty tacos! Tacos dorados called flautas, or taquitos, for which the tortillas are filled with pre-cooked shredded chicken, beef or barbacoa, rolled into an elongated cylinder and deep-fried until crisp. Does guac cost extra? It’s taco time all the time. These tacos are lit. Fish tacos: lettuce or cabbage, pico de gallo, avocado and a sour cream or citrus/mayonnaise sauce, all placed on top of a corn or flour tortilla. How bout a gosh darn quesadilla?</p>",
      description: "This is my second article",
      key: "my-second-article",
      date: new Date(),
      imageUrl:
        "https://angular.io/assets/images/logos/angular/angular_solidBlack.png",
      published: false,
    });
  });
  User.sync();
};

getArticles = function (callback) {
  Article.findAll({
    order: sequelize.literal("date DESC"),
    where: { published: true },
  }).then((articles) => callback(articles));
};

getArticleByKey = function (options, callback) {
  Article.findOne({ where: { key: options.key, published: true } }).then(
    (article) => {
      if (article != null) {
        article.update({
          viewCount: ++article.viewCount,
        });
      }
      callback(article);
    }
  );
};

getDashboardArticles = function (callback) {
  Article.findAll({ order: sequelize.literal("date DESC") }).then((articles) =>
    callback(articles)
  );
};

updateArticlePublishState = function (request, callback) {
  Article.findOne({ where: { id: request.id } }).then(function (article) {
    if (article != null) {
      article.update({
        published: request.published,
      });
    }
    callback(article);
  });
};

getDashBoardArticleByKey = function (key, callback) {
  Article.findOne({ where: { key: key } }).then((article) => callback(article));
};

updateArticle = function (request, callback) {
  Article.findOne({ where: { id: request.id } }).then(function (article) {
    article.update({
      title: request.title,
      key: request.key,
      date: request.date,
      imageUrl: request.imageUrl,
      description: request.description,
      content: request.content,
    });
    callback(article);
  });
};

deleteArticle = function (id, callback) {
  Article.findOne({ where: { id: id } }).then(function (article) {
    if (article != null) {
      article.destroy().then((result) => callback(result));
    } else {
      callback(null);
    }
  });
};

createArticle = function (request, callback) {
  Article.create({
    title: request.title,
    key: request.key,
    date: request.date,
    imageUrl: request.imageUrl,
    description: request.description,
    content: request.content,
  }).then((article) => callback(article));
};

addUser = function (user, callback) {
  User.create({
    name: user.name.toLowerCase(),
    password: user.password,
    salt: user.salt,
  }).then(callback(true));
};

login = function (request, callback) {
  User.findOne({
    where: {
      name: request.name
    }
  }).then(function (user) {
    if (user !== null) {
      var passwordHash = crypto
        .pbkdf2Sync(request.password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      if (passwordHash === user.password) {
        callback(true);
        return;
      }
    }
    callback(false);
  });
};

module.exports.init = init;
module.exports.getArticles = getArticles;
module.exports.getArticleByKey = getArticleByKey;
module.exports.getDashboardArticles = getDashboardArticles;
module.exports.updateArticlePublishState = updateArticlePublishState;
module.exports.getDashBoardArticleByKey = getDashBoardArticleByKey;
module.exports.updateArticle = updateArticle;
module.exports.deleteArticle = deleteArticle;
module.exports.createArticle = createArticle;
module.exports.addUser = addUser;
module.exports.login = login;