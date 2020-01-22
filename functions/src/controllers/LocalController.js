const Local = require('../models/Local');

module.exports = {
    async index(req, res) {
        const locais = await Local.findAll();
        return res.json(locais);
    },

    async store(req, res) {
        const { place_id, nome, latitude, longitude } = req.body;

        const local = await Local.create({
            nome,
            place_id,
            latitude,
            longitude
        });
        return res.json(local);
    }
}