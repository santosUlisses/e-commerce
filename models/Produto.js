const { DataTypes } = require('sequelize');
const conn = require('../db/db');

const Produto = conn.define("Produto", {
    nome_produto: { type: DataTypes.STRING, allowNull: false },
    valor_produto: { type: DataTypes.DECIMAL(10, 2) },
    estoque: { type: DataTypes.INTEGER },
});

module.exports = Produto;