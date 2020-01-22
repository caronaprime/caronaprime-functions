const Usuario = require('../models/Usuario');
const Grupo = require('../models/Grupo');

module.exports = {
    async index(req, res) {
        const usuarios = await Usuario.findAll();
        return res.json(usuarios);

    },

    async store(req, res) {
        // const {a} = req.params;
        const { grupoId: grupoId, nome, celular } = req.body;
        const grupo = await Grupo.findByPk(grupoId);

        if (!grupo) {
            return res.status(404).json({ error: 'Grupo não encontrado' });
        }

        const usuario = await Usuario.create({
            nome,
            celular,
            grupoId
        });
        return res.json(usuario);
    }
}