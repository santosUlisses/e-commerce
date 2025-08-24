const { DataTypes } = require('sequelize');
const conn = require('../db/db');

const Compras = conn.define("Compras", {
    data_compra: { type: DataTypes.DATEONLY },
    valor_total: { type: DataTypes.DECIMAL(10, 2) }
});


module.exports = Compras;