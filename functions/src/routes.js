const express = require('express');
const GrupoController = require('../src/controllers/GrupoController');
const UsuarioController = require('../src/controllers/UsuarioController');
const LocalController = require('../src/controllers/LocalController');
const OfertaCaronaController = require('../src/controllers/OfertaCaronaController');

const routes = express.Router();

routes.post('/grupos', GrupoController.store);
routes.get('/grupos/:id', GrupoController.getById)
routes.get('/grupos/:id/oferta/:usuarioId', GrupoController.getOferta)
routes.post('/grupos/sair', GrupoController.sair)
routes.post('/grupos/compartilhar-carona', GrupoController.compartilharCarona)
routes.post('/grupos/adicionar-membros', GrupoController.adicionarMembros)
routes.post('/grupos/gerar-caronas', GrupoController.gerarCaronas)

routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios', UsuarioController.index);
routes.get('/usuarios/:id/grupos', UsuarioController.grupos)
routes.post('/usuarios/buscar-ou-criar', UsuarioController.buscarOuCriar)
routes.get('/usuarios/:id/proximas-viagens/:grupoId', UsuarioController.proximasViagens)
routes.post('/usuarios/aceitar-carona', UsuarioController.aceitarCarona)
routes.post('/usuarios/recusar-carona', UsuarioController.recusarCarona)

routes.post('/locais', LocalController.store);
routes.get('/locais', LocalController.index);

routes.post('/oferta-caronas', OfertaCaronaController.insert)
routes.get('/oferta-caronas/:id', OfertaCaronaController.getById)
routes.delete('/oferta-caronas/:id', OfertaCaronaController.delete)



module.exports = routes;