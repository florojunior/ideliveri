const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaParceiros = require('./routes/parceiros');
const rotaPedidos = require('./routes/pedidos');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false })); // Apanas dados simples
app.use(bodyParser.json()); // sera aceitado apenas json

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Header',
        'Origin, x-Requrested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        re.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
})

app.use('/parceiros', rotaParceiros);
app.use("/pedidos", rotaPedidos);

//Quando nao encontra rota, entra aqui
app.use((req, res, next) => {
    const erro = new Error("Página não encontrada!");
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem: error.message
        }        
    });
});

module.exports = app;