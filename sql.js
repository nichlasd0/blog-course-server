const Sequelize = require("sequelize");

const sequelize = new Sequelize("blogcourse", "root", "123456",
{
    host: "localhost",
    dialect: "mariadb",
    port: 3308
});

const Article = sequelize.define('article', {
    title: { type: Sequelize.STRING },
    key: { type: Sequelize.STRING },
    date: { type: Sequelize.DATE },
    content: { type: Sequelize.TEXT },
    description: { type: Sequelize.TEXT },
    imageUrl: { type: Sequelize.STRING },
});


init = function() {
    sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has ben esablised successfully");

    }).catch(err => {
        console.error("Unable to connect to the database: ", err);
    });

    Article.sync({force: true})
    .then(() => {
        Article.create({
            title: 'My first article',
            content: '<p>Every day is taco ipsum tuesday. Say taco one more time. I think I’ve overdosed on tacos. How bout a gosh darn quesadilla? How bout a gosh darn quesadilla? BARBACOA!! Black or pinto beans? Tacos Al pastor/De Adobada are made of thin pork steaks seasoned with adobo seasoning, then skewered and overlapped on one another on a vertical rotisserie cooked and flame-broiled as it spins. How do you feel about hard shelled tacos? 50 cent tacos! I’ll take 30. Flour or corn tortillas? Let’s do a beef and a chicken, and one with both.</p> <p>Fish tacos with cabbage slaw and a side of chips and guac. Shrimp tacos are tasty tacos! Tacos dorados called flautas, or taquitos, for which the tortillas are filled with pre-cooked shredded chicken, beef or barbacoa, rolled into an elongated cylinder and deep-fried until crisp. Does guac cost extra? It’s taco time all the time. These tacos are lit. Fish tacos: lettuce or cabbage, pico de gallo, avocado and a sour cream or citrus/mayonnaise sauce, all placed on top of a corn or flour tortilla. How bout a gosh darn quesadilla?</p>',
            description: 'This is my first article',
            key: 'my-first-article',
            date: new Date(),
            imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'
        });
        Article.create({
            title: 'My second article',
            content: '<p>Every day is taco ipsum tuesday. Say taco one more time. I think I’ve overdosed on tacos. How bout a gosh darn quesadilla? How bout a gosh darn quesadilla? BARBACOA!! Black or pinto beans? Tacos Al pastor/De Adobada are made of thin pork steaks seasoned with adobo seasoning, then skewered and overlapped on one another on a vertical rotisserie cooked and flame-broiled as it spins. How do you feel about hard shelled tacos? 50 cent tacos! I’ll take 30. Flour or corn tortillas? Let’s do a beef and a chicken, and one with both.</p> <p>Fish tacos with cabbage slaw and a side of chips and guac. Shrimp tacos are tasty tacos! Tacos dorados called flautas, or taquitos, for which the tortillas are filled with pre-cooked shredded chicken, beef or barbacoa, rolled into an elongated cylinder and deep-fried until crisp. Does guac cost extra? It’s taco time all the time. These tacos are lit. Fish tacos: lettuce or cabbage, pico de gallo, avocado and a sour cream or citrus/mayonnaise sauce, all placed on top of a corn or flour tortilla. How bout a gosh darn quesadilla?</p>',
            description: 'This is my second article',
            key: 'my-second-article',
            date: new Date(),
            imageUrl: 'https://angular.io/assets/images/logos/angular/angular_solidBlack.png'
        })
    });
};

module.exports.init = init;