const Grupo = require('../models/Grupo');
const MembroGrupo = require('../models/MembroGrupo');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');
const Usuario = require('../models/Usuario');
const OfertaCarona = require('../models/OfertaCarona');
const Carona = require('../models/Carona');
const CaronaReposta = require('../models/CaronaReposta');
const { Op } = require('sequelize')

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

function podeEsseDiaDaSemana(oferta, data) {
    const dia = data.getDay();
    if (dia == 0) return oferta.domingo;
    if (dia == 1) return oferta.segunda;
    if (dia == 2) return oferta.terca;
    if (dia == 3) return oferta.quarta;
    if (dia == 4) return oferta.quinta;
    if (dia == 5) return oferta.sexta;
    if (dia == 6) return oferta.sabado;
    return false;
}

async function gerarCarona(oferta, dias) {
    const currentDate = new Date();
    const umDiaEmMs = 86400000;


    for (let i = 0; i < dias; i++) {
        let endDate = new Date(currentDate.getTime() + ((i + 1) * umDiaEmMs));
        if (podeEsseDiaDaSemana(oferta, endDate)) {
            const existeCarona = await Carona.findAll({ where: { ofertaCaronaId: oferta.id, data: endDate } });
            if (!existeCarona || existeCarona.length == 0) {
                await Carona.create({
                    data: endDate,
                    hora: oferta.hora,
                    minuto: oferta.minuto,
                    totalVagas: oferta.totalVagas,
                    portaMalasLivre: oferta.portaMalasLivre,
                    carroAdaptado: oferta.carroAdaptado,
                    ofertaCaronaId: oferta.id,
                    grupoId: oferta.grupoId,
                    usuarioId: oferta.usuarioId
                });
            }
        }
    }
}

module.exports = {
    async gerarCaronas(req, res) {
        try {
            const todasOfertas = await OfertaCarona.findAll({ where: { repetirSemanalmente: true } });
            for (const oferta of todasOfertas) {
                gerarCarona(oferta, 7);
            }
            return res.status(201).send(true);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async adicionarMembros(req, res) {
        try {
            const body = req.body;
            await inserirMembrosGrupos(body.MembroGrupos, body.grupoId);
            return res.status(201).send(true);
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
                const oferta = await OfertaCarona.create(body);
                await gerarCarona(oferta, 4);
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
                oferta.repetirSemanalmente = body.repetirSemanalmente;

                await oferta.save();
            }
            return res.status(201).send(oferta);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async sair(req, res) {
        try {
            const { usuarioId, grupoId } = req.body;
            await MembroGrupo.destroy({ where: { usuarioId: usuarioId, grupoId: grupoId } });
            return res.json({ success: true });
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getOferta(req, res) {
        try {
            const { usuarioId, id } = req.params;
            const oferta = await OfertaCarona.findOne({ where: { usuarioId: usuarioId, grupoId: id } });
            return res.json(oferta);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    async getById(req, res) {
        try {
            let grupo = await Grupo.findByPk(req.params.id, {
                include: [MembroGrupo, LatLong, { model: Local, as: 'partidaGrupo' }, { model: Local, as: 'destinoGrupo' }]
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
            const hoje = new Date();
            const caronas = await Carona.findAll({
                where: {
                    grupoId: req.params.id,
                    data: {
                        [Op.gte]: hoje
                    }
                },
                include: [
                    { model: Usuario, as: 'caronaMotorista' },
                    { model: CaronaReposta, as: 'caronaResposta' }]
            })

            const retorno = {
                Caronas: caronas,
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