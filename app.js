//Definindo Consts
require('dotenv').config();
const express = require('express');
const session = require('express-session')
const UserRoutes = require('./src/routes/UserRoutes');
const DashboardRoutes = require('./src/routes/DashboardRoutes');
const ClientRoutes = require('./src/routes/ClientRoutes');
const JobRoutes = require('./src/routes/JobRoutes');
const path = require('path');
const flash = require('connect-flash')

const logger = require('morgan');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT;

//App.set diretórios
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static(path.join(__dirname, 'public')))

//App.use imports
app.use(logger('dev'))
app.use(flash())
app.use(helmet())

//Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 // um ano
    }
})
)

//Rotas
app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

app.use('/', UserRoutes)
app.use('/', DashboardRoutes)
app.use('/', ClientRoutes)
app.use('/', JobRoutes)

app.use((err, req, res, next) => {


    console.error(err)

    res.status(500).render("erro", {
        title: err.code || '500',
        message: err.customMessage || 'Indeterminado'
    })
})

//middleware generico pega tudo que nao foi tratado antes

app.use((req, res) => {
    res.status(404).render('erro', {
        title: '404',
        message: 'Página não encontrada'
    });
});

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Erro ao iniciar server ' + err);
    }
    console.log(`Servidor rodando em localhost:${PORT}!`)
})