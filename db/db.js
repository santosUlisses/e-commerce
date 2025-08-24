const { Sequelize } = require('sequelize');
require('dotenv').config();


const conn = new Sequelize("e_commerce", "root", process.env.senha_db, { host: "localhost", dialect: "mysql" });


module.exports = conn;