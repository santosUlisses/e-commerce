const { DataTypes } = require('sequelize');
const conn = require('../db/db');

const ProdutoCarrinho = conn.define("ProdutoCarrinho", {
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    preco_unitario: { type: DataTypes.DECIMAL(10, 2) }
});

module.exports = ProdutoCarrinho;