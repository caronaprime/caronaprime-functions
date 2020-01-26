const Grupo = require('../models/Grupo');
const MembroGrupo = require('../models/MembroGrupo');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');
const Usuario = require('../models/Usuario');

async function buscarUsuarioId(usuario) {
    let usuarioId = usuario.UsuarioId;
    if (!usuarioId) {
        const usuarioExiste = await Usuario.findOne({
            where: {
                celular: usuario.celular
            }
        })
        if (usuarioExiste)
            return usuarioExiste.id;

        const u = await Usuario.create({ celular: usuario.celular });
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
        const grupos = await Grupo.findAll({ include: [{ model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }] });
        return res.json(grupos);
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