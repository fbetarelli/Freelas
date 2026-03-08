//Definindo Consts
require('dotenv').config();
const express = require('express');
const session = require('express-session')
const LoginRoutes = require('./src/routes/LoginRoutes');
const path = require('path');

const logger = require('morgan');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT;

//App.set diretórios
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.set(express.static, path.join(__dirname, 'public'))

//App.use imports
app.use(logger('dev'))
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
    res.render('index')
})

app.use('/', LoginRoutes)

app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar server ' + err);
    }
    console.log(`Servidor rodando em localhost:${PORT}!`)
})