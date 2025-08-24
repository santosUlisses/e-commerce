require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

const conn = require('./db/db');
const relacionamentos = require('./models/relacionamentos');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const rotas = require('./router/rotas');
app.use(flash())
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.use((req, res, next) => {
    res.locals.msg_success = req.flash('msg_success');
    res.locals.msg_error = req.flash('msg_error');
    res.locals.nome = req.session.nome;
    res.locals.admin = req.session.admin;
    res.locals.tipo_usuario = req.session.tipo_usuario;
    res.locals.sessaoAtiva = req.session.userId;
    next();
})

app.use('/', rotas);

conn.sync({ force: false }).then(() => { app.listen(3000) }).catch(error => console.log(error));