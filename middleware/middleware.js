class Autenticacao {
    authUsuario(req, res, next) {
        if (!req.session.nome) {
            return res.redirect('/');
        }
        next();
    }
    authAdmin(req, res, next) {
        if (req.session.tipo_usuario !== 'admin') {
            return res.redirect('/painel/usuario');
        }
        next();
    }
    authVendedor(req, res, next) {
        const vendedor = req.session.tipo_usuario;
        if (vendedor !== "vendedor") {
            return res.redirect('/painel/usuario')
        }
        next();
    }
    authLogin(req, res, next) {
        if (req.session.nome) {
            return res.redirect('/painel/usuario');
        }
        next();
    }
}

module.exports = new Autenticacao();