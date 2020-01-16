/*
    Rotas da API
*/
const jwt = require('jwt').middleware

// Roteador
exports.router = (app) => {

    //GRUPOS
    app.get('/grupos', require('./src/grupos/listar'))
    app.post('/grupo', require('./src/grupos/incluir'))
    app.put('/grupo/:grupo', require('./src/grupos/alterar'))
    app.delete('/grupo/:grupo', require('./src/grupos/excluir'))    

    //USUARIOS
    app.get('/usuario', jwt, require('./src/usuarios/obter'))
    app.put('/usuario', jwt, require('./src/usuarios/alterar'))

    //LOGIN
    app.get('/login/:celular', require('./src/login/login'))

}
