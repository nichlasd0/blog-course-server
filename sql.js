const Sequlize = require("sequelize");

const sequelize = new Sequlize("blogcourse", "root", "123456",
{
    host: "localhost",
    dialect: "mariadb",
    port: 3308
});

init = function() {
    sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has ben esablised successfully");

    }).catch(err => {
        console.error("Unable to connect to the database: ", err);
    });
};

module.exports.init = init;