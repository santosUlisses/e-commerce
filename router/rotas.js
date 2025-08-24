const express = require('express');
const rota = express.Router();
const Controller = require('../controller/Controller');
const Autenticacao = require('../middleware/middleware')

rota.get('/', Autenticacao.authLogin, Controller.home);
rota.get('/cadastro', Autenticacao.authLogin, Controller.pagCadastro);
rota.post('/cadastrar', Controller.cadastrar);
rota.post('/login', Controller.login);
rota.get('/logout', Controller.logout);
rota.get('/painel/admin', Autenticacao.authAdmin, Controller.painelAdm);
rota.get('/painel/usuario', Autenticacao.authUsuario, Controller.painelUsuario);
rota.get('/painel/vendedor', Autenticacao.authVendedor, Controller.painelVendedor);
rota.get('/adicionar/categoria', Autenticacao.authAdmin, Controller.pagAddCategoria);
rota.post('/adicionar/categoria', Controller.adicionarCategoria);
rota.get('/editar/categoria/:id', Autenticacao.authAdmin, Controller.pagEditarCategoria);
rota.post('/editar/categoria', Controller.editarCategoria);
rota.get('/deletar/categoria/:id', Autenticacao.authAdmin, Controller.deletarCategoria);
rota.get('/formulario/vendedor', Autenticacao.authUsuario, Controller.pagFormularioVendedor);
rota.post('/formulario/vendedor', Controller.formularioVendedor);
rota.get('/solicitacoes/vendedor', Autenticacao.authAdmin, Controller.solicitacoesVendedor);
rota.post('/aprovar/solicitacao', Controller.aprovarSolicitacao);
rota.post('/reprovar/solicitacao', Controller.reprovarSolicitacao);
rota.get('/lista/vendedores', Autenticacao.authAdmin, Controller.listaVendedores);
rota.post('/editar/vendedor', Controller.editarVendedor);
rota.get('/adicionar/produto', Controller.pagAdicionarProduto);
rota.post('/adicionar/produto', Controller.adicionarProduto);
rota.post('/remover/produto', Controller.removerProduto);
rota.get('/lista/produtos', Controller.listaProdutos);
rota.get('/lista/produtos/vendedor/:id', Controller.listaProdutosVendedor);
rota.get('/editar/produto/:id', Controller.encontrarProduto);
rota.get('/editar/dados/:id', Controller.pagEditarDados);
rota.post('/editar/dados/', Controller.editarDados);
rota.post('/editar/produto', Controller.editarProduto);
rota.post('/deletar/produto/:id', Controller.deletarProduto);
rota.get('/adicionar/carrinho/:id', Controller.pagAddCarrinho);
rota.post('/adicionar/carrinho', Controller.adicionarCarrinho);
rota.get('/carrinho/usuario', Controller.carrinhoUsuario);
rota.post('/finalizar/compra', Controller.finalizarCompra);
rota.get('/lista/compras', Controller.listaCompras);
rota.get('/vendas/usuario', Autenticacao.authVendedor, Controller.vendasUsuario);
rota.get('/vendedor/detalhes/:id', Controller.detalhesVendedor);



module.exports = rota;