const Grupo = require('../models/Grupo');
const MembroGrupo = require('../models/MembroGrupo');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');
const Usuario = require('../models/Usuario');
const OfertaCarona = require('../models/OfertaCarona');
const Carona = require('../models/Carona');

async function buscarUsuarioId(usuario) {
    let usuarioId = usuario.UsuarioId;
    const celular = usuario.celular.match(/\d+/g).join('');
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
        const grupos = await Grupo.findAll({ include: [OfertaCarona, { model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }] });
        return res.json(grupos);
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