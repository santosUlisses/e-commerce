const { DataTypes, ENUM } = require('sequelize')
const conn = require('../db/db');

const User = conn.define("User", {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    tipo_usuario: { type: ENUM("cliente", "admin", "vendedor"), defaultValue: "cliente" },
});

module.exports = User;