require('dotenv').config();
const express = require('express');
const session = require('express-session')
const path = require('path')
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static, path.join(__dirname, 'public'))


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
})
)


app.get('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar server ' + err);
    }
    console.log(`Servidor rodando em localhost:${PORT}!`)
})