const Carrinho = require("./Carrinho");
const Categoria = require("./Categoria");
const Cnpj = require("./Cnpj");
const Compras = require("./Compras");
const Produto = require("./Produto");
const ProdutoCarrinho = require("./ProdutoCarrinho");
const Solicitacao = require("./Solicitacao");
const User = require("./User");


User.hasMany(Carrinho);
Carrinho.belongsTo(User);
User.hasMany(Compras);
Compras.belongsTo(User);
User.hasMany(Produto)
Produto.belongsTo(User)
Solicitacao.belongsTo(User);
Cnpj.belongsTo(User);
User.hasOne(Cnpj);


Produto.belongsTo(Categoria, { foreignKey: 'CategoriaId', });
Categoria.hasMany(Produto, { foreignKey: 'CategoriaId', });


Produto.belongsToMany(Carrinho, { through: ProdutoCarrinho });
Carrinho.belongsToMany(Produto, { through: ProdutoCarrinho });


ProdutoCarrinho.belongsTo(Produto);
ProdutoCarrinho.belongsTo(Carrinho);


Produto.hasMany(ProdutoCarrinho);
Carrinho.hasMany(ProdutoCarrinho);


Carrinho.hasOne(Compras);
Compras.belongsTo(Carrinho);





module.exports = {
    Carrinho, Categoria, Compras, Produto, ProdutoCarrinho, User, Solicitacao, Cnpj
}