const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {

})


app.listen(PORT, (err) => {
    if (err) {
        console.error('Erro ao iniciar server ' + err);
    }
    console.log(`Servidor rodando em localhost:${PORT}!`)
})