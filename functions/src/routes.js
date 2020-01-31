const express = require('express');
const GrupoController = require('../src/controllers/GrupoController');
const UsuarioController = require('../src/controllers/UsuarioController');
const LocalController = require('../src/controllers/LocalController');
const OfertaCaronaController = require('../src/controllers/OfertaCaronaController');

const routes = express.Router();

routes.post('/grupos', GrupoController.store);
routes.get('/grupos', GrupoController.index);
routes.get('/grupos/:id', GrupoController.getById)
routes.post('/grupos/compartilhar-carona', GrupoController.compartilharCarona)

routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios', UsuarioController.index);
routes.post('/usuarios/buscar-ou-criar', UsuarioController.buscarOuCriar)

routes.post('/locais', LocalController.store);
routes.get('/locais', LocalController.index);

routes.post('/ofertaCaronas', OfertaCaronaController.insert)



module.exports = routes;