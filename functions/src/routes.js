const express = require('express');
const GrupoController = require('../src/controllers/GrupoController');
const UsuarioController = require('../src/controllers/UsuarioController');
const LocalController = require('../src/controllers/LocalController');

const routes = express.Router();

routes.post('/grupos', GrupoController.store);
routes.get('/grupos', GrupoController.index);

routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios', UsuarioController.index);

routes.post('/locais', LocalController.store);
routes.get('/locais', LocalController.index);


module.exports = routes;