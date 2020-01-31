const Grupo = require('../models/Grupo');
const MembroGrupo = require('../models/MembroGrupo');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');
const Usuario = require('../models/Usuario');
const OfertaCarona = require('../models/OfertaCarona');
const Carona = require('../models/Carona');

async function buscarUsuarioId(usuario) {
    let usuarioId = usuario.UsuarioId;
    let celular = usuario.celular.match(/\d+/g).join('');
    if (celular.length > 11)
        celular = celular.substring(celular.length - 11);

    if (!usuarioId) {
        const usuarioExiste = await Usuario.findOne({
            where: {
                celular: celular
            }
        })
        if (usuarioExiste)
            return usuarioExiste.id;

        const u = await Usuario.create({ celular, nome: usuario.nome });
        return u.id;
    }
    return usuarioId;
}

async function inserirMembrosGrupos(membrosGrupos, grupoId) {
    const membros = [];
    for (const membro of membrosGrupos) {
        let usuarioId = await buscarUsuarioId(membro.usuario);
        membros.push({
            usuarioId,
            grupoId: grupoId,
            administrador: membro.administrador ? true : false
        });
    }
    await MembroGrupo.bulkCreate(membros);
}

module.exports = {
    async index(req, res) {
        try {
            const grupos = await Grupo.findAll({
                include: [{ model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }, MembroGrupo], where: {
                    '$MembroGrupos.usuarioId$': req.body.usuarioId
                }
            });
            return res.json(grupos);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async compartilharCarona(req, res) {
        try {
            const body = req.body;
            let oferta = await OfertaCarona.findOne({
                where: {
                    usuarioId: body.usuarioId,
                    grupoId: body.grupoId
                }
            });
            if (!oferta) {
                await OfertaCarona.create(body);
            }
            else {
                oferta.portaMalasLivre = body.portaMalasLivre;
                oferta.carroAdaptado = body.carroAdaptado;
                oferta.hora = body.hora;
                oferta.minuto = body.minuto;
                oferta.totalVagas = body.totalVagas;
                oferta.domingo = body.domingo;
                oferta.segunda = body.segunda;
                oferta.terca = body.terca;
                oferta.quarta = body.quarta;
                oferta.quinta = body.quinta;
                oferta.sexta = body.sexta;
                oferta.sabado = body.sabado;

                await oferta.save();
            }
            return res.status(201).send(oferta);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async getById(req, res) {
        try {
            let grupo = await Grupo.findByPk(req.params.id, {
                include: [MembroGrupo, Carona, LatLong, { model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }]
            })
            const usuariosIds = grupo.MembroGrupos.map(mg => mg.usuarioId);
            const usuarios = await Usuario.findAll({
                where: {
                    id: usuariosIds
                }
            })
            const membrosgrupos = [];
            for (const membroGrupo of grupo.MembroGrupos) {
                const usuario = usuarios.find(t => t.id == membroGrupo.usuarioId);
                membrosgrupos.push({
                    id: membroGrupo.id,
                    administrador: membroGrupo.administrador,
                    grupoId: membroGrupo.id,
                    usuario: {
                        celular: usuario.celular,
                        nome: usuario.nome,
                        id: usuario.id
                    }
                });
            }
            const retorno = {
                Caronas: grupo.Caronas,
                LatLongs: grupo.LatLongs,
                destinoGrupo: grupo.destinoGrupo,
                destinoId: grupo.destinoId,
                id: grupo.id,
                MembroGrupos: membrosgrupos,
                nome: grupo.nome,
                partidaGrupo: grupo.partidaGrupo,
                partidaId: grupo.partidaId
            };
            return res.json(retorno);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    async store(req, res) {
        try {
            const { nome, MembroGrupos, LatLongs, partidaGrupo, destinoGrupo } = req.body;

            const partida = await Local.create({ ...partidaGrupo });
            const destino = await Local.create({ ...destinoGrupo });

            const grupo = await Grupo.create({ nome, partidaId: partida.id, destinoId: destino.id });

            await inserirMembrosGrupos(MembroGrupos, grupo.id);

            const teste = LatLongs.map(lg => {
                return { ...lg, grupoId: grupo.id }
            });
            LatLong.bulkCreate(teste);

            return res.json(grupo);
        } catch (error) {
            res.status(500).send(error);
        }

    }

}