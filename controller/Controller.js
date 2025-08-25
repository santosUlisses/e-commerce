const User = require("../models/User");
const Categoria = require("../models/Categoria");
const Solicitacao = require("../models/Solicitacao");
const Cnpj = require("../models/Cnpj");
const Produto = require("../models/Produto");
const Carrinho = require("../models/Carrinho");
const ProdutoCarrinho = require("../models/ProdutoCarrinho");
const Compras = require("../models/Compras");
const Service = require('../services/Services');
const bcrypt = require('bcrypt');


class Controller {
    async home(req, res) {
        res.render('home');
    }
    pagCadastro(req, res) {
        res.render('cadastro');
    }

    async cadastrar(req, res) {
        const { nome, email, senha } = req.body;
        try {

            const validar = !!await User.findOne({ where: { email: email } });
            if (validar === false) {
                const salt = await bcrypt.genSalt(10)
                const senhaHash = await bcrypt.hash(senha, salt);
                const user = await User.create({ nome, email, senha: senhaHash });
                if (user.id !== 1) {
                    await Carrinho.create({ UserId: user.id });
                }
                if (user.id === 1) {
                    await user.update({ tipo_usuario: "admin" }, { where: { id: 1 } });
                }
                res.redirect('/');
            } else {
                req.flash('msg_error', "email já cadastrado");
                res.redirect('/cadastro')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const user = await User.findOne({ where: { email: email } });

            if (!user || user === null || !senha || senha === null) {
                req.flash('msg_error', 'Login ou senha inválido')
                res.redirect('/');
                return
            }

            const auth = await bcrypt.compare(senha, user.senha);
            if (auth === true) {
                req.session.userId = user.id;
                req.session.nome = user.nome;
                req.session.tipo_usuario = user.tipo_usuario;
                if (user.tipo_usuario === "admin") {
                    req.session.admin = 'admin';
                    res.redirect('/painel/admin');
                    return
                }
                res.redirect('/painel/usuario');
                console.log(req.session);

            } else {
                console.log('senha errada')
                req.flash('msg_error', 'Login ou senha inválido')
                res.redirect('/');
            }

        } catch (error) {
            console.log(error);
        }

    }

    logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                console.log(error)
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    }

    painelAdm(req, res) {
        res.render('painel_adm')
    }

    painelUsuario(req, res) {
        let cliente = false;
        if (req.session.tipo_usuario === "cliente") {
            cliente = true;
        }
        res.render('painel_usuario', { cliente });
    }
    painelVendedor(req, res) {
        res.render('painel_vendedor')
    }
    async pagAddCategoria(req, res) {
        const categorias = await Categoria.findAll({ raw: true });

        res.render("adicionar_categoria", { categorias });
    }

    async adicionarCategoria(req, res) {
        const nome = req.body.nome;
        try {
            await Categoria.create({ nome_categoria: nome });
            res.redirect('/adicionar/categoria')
        } catch (error) {
            console.log(error);
        }
    }

    async pagEditarCategoria(req, res) {
        const { id } = req.params
        try {
            const categoria = await Categoria.findOne({ where: { id: id }, raw: true });
            res.render('editar_categoria', { categoria });
        } catch (error) {
            console.log(error);
        }
    }

    async editarCategoria(req, res) {
        const { id, nome } = req.body;
        try {
            await Categoria.update({ nome_categoria: nome }, { where: { id: id } });
            res.redirect('/adicionar/categoria');
        } catch (error) {

        }
    }
    async deletarCategoria(req, res) {
        const { id } = req.params;
        try {
            await Categoria.destroy({ where: { id: id } });
            res.redirect('/adicionar/categoria');
        } catch (error) {
            console.log(error);
        }
    }

    pagFormularioVendedor(req, res) {
        res.render('formulario_vendedor');
    }
    async formularioVendedor(req, res) {
        const { cnpj, UserId, tipo_produto } = req.body;
        const data = new Date;
        const dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`
        console.log(dataFormatada)

        try {
            const validar = !!await Cnpj.findOne({ where: { cnpj: cnpj } });
            const validarSolicitacao = !!await Solicitacao.findOne({ where: { cnpj: cnpj, status: "pendente" } });
            if (validar === false && validarSolicitacao === false) {
                await Solicitacao.create({ cnpj, UserId, tipo_produto, data: dataFormatada });
                req.flash('msg_success', "formulario enviado");
                res.redirect('/formulario/vendedor');
            } else {
                req.flash('msg_error', "CNPJ cadastrado");
                res.redirect('/formulario/vendedor');

            }

        } catch (error) {
            console.log(error)
        }

    }


    async solicitacoesVendedor(req, res) {
        const formatarDados = (await Solicitacao.findAll({ where: { status: "pendente" }, include: [{ model: User, attributes: ['nome'] }] })).map(f => f.get({ plain: true }));
        const solicitacoes = formatarDados.map((dado) => {
            return {
                idSolicitacao: dado.id,
                idUsuario: dado.UserId,
                nome: dado.User.nome,
                status: dado.status,
                cnpj: dado.cnpj,
                tipo_produto: dado.tipo_produto,
            }
        });

        res.render('solicitacoes', { solicitacoes });
    }

    async aprovarSolicitacao(req, res) {
        const { cnpj, UserId, idSolicitacao, tipo_produto } = req.body;
        try {
            const validarCategoria = !!await Categoria.findOne({ where: { nome_categoria: tipo_produto } });

            if (validarCategoria === false) {
                await Categoria.create({ nome_categoria: tipo_produto });
            }
            await Promise.all([
                Solicitacao.update({ status: "aprovada" }, { where: { id: idSolicitacao } }),
                Cnpj.create({ cnpj, UserId }),
                User.update({ tipo_usuario: "vendedor" }, { where: { id: UserId } }),
            ]);
            res.redirect('/solicitacoes/vendedor');
        } catch (error) {
            console.log(error);
            res.redirect('/solicitacoes/vendedor');
        }
    }

    async reprovarSolicitacao(req, res) {
        const { idSolicitacao } = req.body;
        try {
            await Solicitacao.update({ status: "reprovada" }, { where: { id: idSolicitacao } });
            res.redirect('/solicitacoes/vendedor');
        } catch (error) {
            console.log(error);
        }
    }

    async listaVendedores(req, res) {
        const vendedores = await User.findAll({ where: { tipo_usuario: "vendedor" }, raw: true });

        res.render('lista_vendedores', { vendedores });
    }

    async editarVendedor(req, res) {
        const { id, tipo_usuario } = req.body;
        try {
            await User.update({ tipo_usuario: tipo_usuario }, { where: { id: id } });
            req.flash('msg_success', 'usuario atualizado!');
            res.redirect('/lista/vendedores');
        } catch (error) {
            console.log(error)

            res.redirect('/painel/admin');
        }
    }



    async pagAdicionarProduto(req, res) {
        const categorias = await Categoria.findAll({ raw: true });
        res.render('adicionar_produto', { categorias });
    }

    async adicionarProduto(req, res) {
        const { nome_produto, valor_produto, estoque, UserId, CategoriaId } = req.body;
        try {
            await Produto.create({ nome_produto, valor_produto, estoque, UserId, CategoriaId });
            req.flash('msg_success', 'produto adicionado');
            res.redirect('/adicionar/produto');
        } catch (error) {
            console.log(error);
            res.redirect('/painel/vendedor');

        }
    }

    async listaProdutos(req, res) {
        try {
            const produtos = await Produto.findAll({ raw: true });
            res.render('lista_produtos', { produtos });
        } catch (error) {
            console.log(error)
        }
    }

    async listaProdutosVendedor(req, res) {
        const { id } = req.params;
        try {
            const produtos = await (await Produto.findAll({ where: { UserId: id }, include: [{ model: Categoria, attributes: ['nome_categoria'] }] })).map(p => p.get({ plain: true }));
            const produtosFormatados = produtos.map(p => {
                return {
                    id: p.id,
                    nome_produto: p.nome_produto,
                    valor_produto: p.valor_produto,
                    estoque: p.estoque,
                    categoria: p.Categorium.nome_categoria,
                }
            });

            res.render('lista_produtos_vendedor', { produtosFormatados });
        } catch (error) {
            console.log(error);
        }
    }

    async encontrarProduto(req, res) {
        const { id } = req.params;
        try {
            const produto = [await Produto.findOne({ where: { id }, include: [{ model: Categoria, attributes: ['nome_categoria'] }] })];
            const categorias = await Categoria.findAll({ raw: true });

            let produtoFormatado
            produto.forEach((item) => {
                item.get({ plain: true });
                produtoFormatado = {
                    id: item.id,
                    nome_produto: item.nome_produto,
                    valor_produto: item.valor_produto,
                    estoque: item.estoque,
                    CategoriaId: item.CategoriaId,
                    categoria: item.Categorium.nome_categoria
                }
                return produtoFormatado
            });


            res.render('editar_produto', { produtoFormatado, categorias });
        } catch (error) {
            console.log(error);

        }
    }

    async editarProduto(req, res) {
        const { sessaoAtiva, id, nome_produto, valor_produto, estoque, CategoriaId } = req.body;
        try {
            await Produto.update({ nome_produto, valor_produto, estoque, CategoriaId }, { where: { id } });
            req.flash('msg_success', 'produto editado');
            res.redirect(`/editar/produto/${id}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/lista/produtos/vendedor/${sessaoAtiva}`)
        }
    }

    async pagEditarDados(req, res) {
        const id = req.session.userId;
        try {
            const usuario = await User.findOne({ where: { id: id }, raw: true });
            res.render('editar_dados', { usuario });
        } catch (error) {
            console.log(error);
        }
    }

    async editarDados(req, res) {
        const { id, nome, email, senha } = req.body;
        try {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            if (senha === null || senha === "") {
                await User.update({ nome, email }, { where: { id: id } });
                req.flash('msg_success', 'dados atualizados')
                res.redirect(`/editar/dados/${id}`);
                return
            } else {
                await User.update({ nome, email, senha: senhaHash }, { where: { id: id } });
                req.flash('msg_success', 'dados atualizados')
                res.redirect(`/editar/dados/${id}`);
            }
        } catch (error) {
            console.log(error);
            res.redirect('/painel/usuario');
        }
    }

    async deletarProduto(req, res) {
        const { id } = req.params;
        try {
            await Produto.destroy({ where: { id } });
            res.redirect('/painel/vendedor');
        } catch (error) {
            console.log(error);
        }
    }

    async pagAddCarrinho(req, res) {
        const { id } = req.params
        const produto = await Produto.findOne({ where: { id }, raw: true });
        res.render('adicionar_carrinho', { produto });
    }

    async adicionarCarrinho(req, res) {
        const { UserId, quantidade, preco_unitario, ProdutoId } = req.body;
        try {
            const carrinho = await Carrinho.findOne({ where: { UserId: UserId, status: "ativo" } });
            await ProdutoCarrinho.create({ quantidade, preco_unitario, ProdutoId, CarrinhoId: carrinho.id });
            req.flash('msg_success', 'Produto adicionado ao carrinho');
            res.redirect('/lista/produtos');
        } catch (error) {
            console.log(error);
            res.redirect(`/carrinho/usuario`);
        }

    }

    async carrinhoUsuario(req, res) {
        const id = req.session.userId;
        try {
            const carrinho = [await Carrinho.findOne({ where: { UserId: id, status: "ativo" }, include: [{ model: ProdutoCarrinho }, { model: Produto }], })];
            const produtos = [];
            let idCarrinho = 0;
            carrinho.forEach((item) => {
                const produto = item.get({ plain: true }).Produtos.map(m => {
                    idCarrinho = item.get({ plain: true }).id

                    return {
                        id_carrinho: item.id,
                        id: m.id,
                        nome_produto: m.nome_produto,
                        quantidade: m.ProdutoCarrinho.quantidade,
                        preco_unitario: m.ProdutoCarrinho.preco_unitario,
                        total: Number(m.ProdutoCarrinho.quantidade) * Number(m.ProdutoCarrinho.preco_unitario),
                    }
                });
                produtos.push(produto);
            });
            const produtosCarrinho = produtos[0]
            const valorTotal = produtosCarrinho.map(v => v.total).reduce((a, i) => a + i, 0).toFixed(2);


            res.render('carrinho_usuario', { produtosCarrinho, valorTotal, idCarrinho });

        } catch (error) {
            console.log(error);
            res.redirect('/painel/usuario');
        }
    }


    async removerProduto(req, res) {
        const { ProdutoId, CarrinhoId } = req.body;
        console.log({ ProdutoId, CarrinhoId });
        try {
            await ProdutoCarrinho.destroy({ where: { ProdutoId: ProdutoId, CarrinhoId: CarrinhoId } });
            req.flash('msg_success', 'produto removido')
            res.redirect('/carrinho/usuario');
        } catch (error) {
            console.log(error);
        }
    }


    async finalizarCompra(req, res) {
        const { valor_total, UserId, CarrinhoId } = req.body;
        const data = new Date;
        const data_compra = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`
        console.log(valor_total);
        try {
            const itemsCarrinho = await ProdutoCarrinho.findAll({ where: { CarrinhoId: CarrinhoId }, attributes: ['ProdutoId', 'quantidade'] });
            await Promise.all(
                itemsCarrinho.map(async item => {
                    const produto = await Produto.findByPk(item.ProdutoId);
                    if (produto) {
                        await Produto.update({ estoque: produto.estoque - item.quantidade }, { where: { id: item.ProdutoId } })
                    }
                }),
            );
            await Promise.all([
                Compras.create({ data_compra, valor_total, UserId, CarrinhoId }),
                Carrinho.update({ status: "finalizado" }, { where: { id: CarrinhoId } }),
                Carrinho.create({ UserId: UserId }),
            ]);

            Service.gerarPix(res, parseFloat(valor_total));

        } catch (error) {
            console.log(error);

        }
    }




    async listaCompras(req, res) {
        const userId = req.session.userId;
        try {
            const historico = await Compras.findAll({ where: { UserId: userId }, include: [{ model: Carrinho, where: { status: "finalizado" }, include: [{ model: ProdutoCarrinho, include: [{ model: Produto, attributes: ['nome_produto'] }] }] },] });
            const lista_compras = historico.map(m => {
                const dados = m.get({ plain: true });
                const detalhes = dados.Carrinho.ProdutoCarrinhos
                return {
                    data: dados.data_compra,
                    valor_total: dados.valor_total,
                    detalhes_compra: detalhes.map(d => {
                        return {
                            nome: d.Produto.nome_produto,
                            quantidade: d.quantidade,
                            preco_unitario: d.preco_unitario,
                        }
                    }),
                }
            });

            res.render('lista_compras', { lista_compras });

        } catch (error) {
            console.log(error)
        }
    }


    async vendasUsuario(req, res) {
        const UserId = req.session.userId;
        try {
            const produtos = await Produto.findAll({
                where: { UserId: UserId },
                attributes: ['id', 'nome_produto'],
                include: [
                    {
                        model: ProdutoCarrinho,
                        attributes: ['quantidade', 'preco_unitario']
                    },
                    {
                        model: Carrinho,
                        where: { status: "finalizado" },
                    }
                ]
            });

            const dadosFormatado = produtos.map(p => p.get({ plain: true }));

            const agrupado = {};

            dadosFormatado.forEach(produto => {
                produto.ProdutoCarrinhos.forEach(pvenda => {
                    if (!agrupado[produto.nome_produto]) {
                        agrupado[produto.nome_produto] = {
                            nome: produto.nome_produto,
                            quantidade: 0,
                            preco_unitario: pvenda.preco_unitario,
                            total: 0
                        };
                    }

                    agrupado[produto.nome_produto].quantidade += pvenda.quantidade;
                    agrupado[produto.nome_produto].total += pvenda.quantidade * pvenda.preco_unitario;
                });
            });

            const vendas = Object.values(agrupado);
            const totalVendas = vendas.map(v => v.total).reduce((a, i) => a + i, 0).toLocaleString('pt-BR', { style: "currency", currency: "BRL" });
            res.render('vendas_usuario', { vendas, totalVendas });

        } catch (error) {
            console.log(error);
        }
    }



    async detalhesVendedor(req, res) {
        const { id } = req.params;
        try {
            const detalhes = await User.findAll({ include: [{ model: Produto, include: [{ model: Categoria, attributes: ['nome_categoria'] }] }, { model: Cnpj }], where: { id: id } });
            const detalhes_vendedor = detalhes.map(m => {

                const dados = m.get({ plain: true });

                return {
                    nome: dados.nome,
                    email: dados.email,
                    cnpj: dados.Cnpj.cnpj,
                    tipo_usuario: dados.tipo_usuario,
                    produtos: dados.Produtos.map(p => { return { nome_produto: p.nome_produto, valor_produto: p.valor_produto, categoria: p.Categorium.nome_categoria } }),
                }

            });

            const produtosVendidos = await Produto.findAll({
                where: { UserId: id }, include: [{ model: ProdutoCarrinho, attributes: ['quantidade', 'preco_unitario'], include: [{ model: Carrinho, where: { status: "finalizado" } }] },]
            });

            const total = []
            produtosVendidos.map(m => {
                const dados = m.get({ plain: true });
                dados.ProdutoCarrinhos.forEach((pc) => {
                    total.push(pc.quantidade * parseFloat(pc.preco_unitario));
                });

            });

            const total_vendas = total.reduce((a, i) => a + i, 0)




            res.render('detalhes_vendedor', { detalhes_vendedor, total_vendas });
        } catch (error) {
            console.log(error);
            res.redirect('/painel/admin')
        }
    }

}


module.exports = new Controller();