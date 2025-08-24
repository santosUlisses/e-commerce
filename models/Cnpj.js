const { DataTypes } = require("sequelize");
const conn = require('../db/db');


const Cnpj = conn.define("Cnpj", {
    cnpj: { type: DataTypes.STRING, unique: true },
}, { tableName: "cnpj" });

module.exports = Cnpj;