const { Model, DataTypes } = require('sequelize');

class Carona extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            dataHora: DataTypes.DATE,
            totalVagas: DataTypes.INTEGER,
            portaMalasLivre: DataTypes.BOOLEAN,
            carroAdaptado: DataTypes.BOOLEAN,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Grupo);
        this.hasMany(models.UsuarioCarona);
    }
}

module.exports = Carona;