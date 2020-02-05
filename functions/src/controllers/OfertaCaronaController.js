const OfertaCarona = require('../models/OfertaCarona');
const Grupo = require('../models/Grupo');

module.exports = {
    async insert(req, res) {
        try {

            const grupoId = req.body.grupoId;
            const grupo = await Grupo.findByPk(grupoId);

            if (!grupo) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            const ofertaCarona = await OfertaCarona.create(req.body);
            return res.json(ofertaCarona);

        } catch (error) {
            res.status(500).send(error);
        }
    },

    async getById(req, res) {
        try {

            const oferta = await OfertaCarona.findByPk(req.params.id);

            if (!oferta) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            return res.json(oferta);

        } catch (error) {
            res.status(500).send(error);
        }
    },
    async delete(req, res) {
        try {

            await OfertaCarona.destroy({ where: { id: req.params.id } });

            return res.json(true);

        } catch (error) {
            res.status(500).send(error);
        }
    }
}