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
    }
}