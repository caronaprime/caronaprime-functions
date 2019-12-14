/*
    Cloud Functions
*/

// Importar bibliotecas
const process = require('process')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

// Criar aplicação Express
const app = express()

// Adicionar Helmet (uma biblioteca para adicionar algumas camadas de segurança)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Capturar erros
app.use(function(req, res, next) {
    // Capturar erros
    process.on('unhandledRejection', (reason, promise) => {
        console.error(reason)

        if (res.headersSent) {
            return next()
        }
        res.status(500).send("Internal Server Error")
    })
    process.on('uncaughtException', (err) => {
        console.error(err)

        if (res.headersSent) {
            return next()
        }
        res.status(500).send("Internal Server Error")
    })

    next()
})

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Rotear requisições
require('./routes').router(app)

// Expor aplicação Express ao Cloud Functions
app.listen(process.env.PORT || 8080)
