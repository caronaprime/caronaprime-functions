const Usuario = require('../models/Usuario');
const Grupo = require('../models/Grupo');
const Local = require('../models/Local');
const Carona = require('../models/Carona');
const CaronaResposta = require('../models/CaronaReposta');
const MembroGrupo = require('../models/MembroGrupo');
const { Op } = require('sequelize')

module.exports = {
    async index(req, res) {
        const usuarios = await Usuario.findAll();
        return res.json(usuarios);

    },
    async recusarCarona(req, res) {
        try {
            const caronaId = req.body.caronaId;
            const usuarioId = req.body.usuarioId;

            const resposta = await CaronaResposta.create({
                caronaId,
                usuarioId,
                aceitou: false
            });
            return res.json({ sucesso: true, resposta });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async aceitarCarona(req, res) {
        try {
            const caronaId = req.body.caronaId;
            const usuarioId = req.body.usuarioId;
            const carona = await Carona.findByPk(caronaId);
            const caronasRespostas = await CaronaResposta.findAll({ where: { aceitou: true, caronaId: caronaId } });

            if (caronasRespostas.length >= carona.totalVagas)
                return res.json({ sucesso: false, motivo: "Ja atingiu o limite de caroneiros." });

            const jaAceitou = caronasRespostas.filter(resp => resp.usuarioId == usuarioId);
            if (jaAceitou.length > 0)
                return res.json({ sucesso: false, motivo: "O usuario já aceitou esta carona." });

            const resposta = await CaronaResposta.create({
                caronaId,
                usuarioId,
                aceitou: true
            });
            return res.json({ sucesso: true, resposta });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    async proximasViagens(req, res) {
        try {
            const grupoId = req.params.grupoId;
            const usuarioId = req.params.id;

            const hoje = new Date();
            const carona = await Carona.findAll({
                where: {
                    [Op.or]: [
                        { usuarioId: usuarioId },
                        {
                            '$caronaResposta.usuarioId$': usuarioId,
                            '$caronaResposta.aceitou$': true,
                        }
                    ],
                    grupoId: grupoId,
                    data: {
                        [Op.gte]: hoje
                    }
                },
                include: [{ model: CaronaResposta, as: 'caronaResposta' }, { model: Usuario, as: 'caronaMotorista' }]
            });

            return res.json(carona);
        } catch (error) {
            res.status(500).send(error);
        }
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