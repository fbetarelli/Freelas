require('dotenv').config();
const express = require('express');
const path = require('path')
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))



app.get('/', (req, res) => {
    res.render('index')
})


app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar server ' + err);
    }
    console.log(`Servidor rodando em localhost:${PORT}!`)
})