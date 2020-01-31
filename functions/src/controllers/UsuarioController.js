const Usuario = require('../models/Usuario');
const Grupo = require('../models/Grupo');
const Local = require('../models/Local');
const MembroGrupo = require('../models/MembroGrupo');

module.exports = {
    async index(req, res) {
        const usuarios = await Usuario.findAll();
        return res.json(usuarios);

    },

    async buscarOuCriar(req, res) {
        try {
            let numeroFormatado = req.body.numero.match(/\d+/g).join('');
            if (numeroFormatado.length > 11)
                numeroFormatado = numeroFormatado.substring(numeroFormatado.length - 11);


            let usuario = await Usuario.findOne({
                where: {
                    celular: numeroFormatado
                }
            });
            if (usuario) {
                usuario.userId = req.body.userId;
                await usuario.save();
                return res.json(usuario);
            }

            const usuarioCriado = await Usuario.create({
                nome: req.body.nome,
                celular: numeroFormatado,
                userId: req.body.userId
            });

            return res.json(usuarioCriado);
        } catch (error) {
            res.status(500).send(error);
        }

    },

    async store(req, res) {
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
    },
    async grupos(req, res) {
        try {
            const grupos = await Grupo.findAll({
                include: [{ model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }, MembroGrupo], where: {
                    '$MembroGrupos.usuarioId$': req.params.id
                }
            });
            return res.json(grupos);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
}