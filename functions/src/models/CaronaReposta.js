const { Model, DataTypes } = require('sequelize');

class CaronaResposta extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            aceitou: DataTypes.BOOLEAN,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Carona, { foreignKey: 'caronaId', as: 'caronaResposta' });
        this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuarioResposta' });
    }
}

module.exports = CaronaResposta;