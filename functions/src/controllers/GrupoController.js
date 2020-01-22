const Grupo = require('../models/Grupo');
const MembroGrupo = require('../models/MembroGrupo');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');

module.exports = {
    async index(req, res) {
        const grupos = await Grupo.findAll({ include: [MembroGrupo, LatLong, { model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }] });
        return res.json(grupos);
    },

    async store(req, res) {
        const { id, nome } = req.body;

        const grupo = await Grupo.create({ nome });

        return res.json(grupo);
    }
}