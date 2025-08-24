const { DataTypes } = require('sequelize')
const conn = require('../db/db');


const Categoria = conn.define("Categoria", {
    nome_categoria: { type: DataTypes.STRING }
});

module.exports = Categoria;