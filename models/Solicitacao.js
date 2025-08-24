const { DataTypes, ENUM } = require('sequelize');
const conn = require('../db/db');


const Solicitacao = conn.define("Solicitacao", {
    status: { type: ENUM("pendente", "aprovada", "reprovada"), defaultValue: "pendente" },
    tipo_produto: { type: DataTypes.STRING },
    cnpj: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.DATEONLY }
}, { tableName: "solicitacoes" });


module.exports = Solicitacao;