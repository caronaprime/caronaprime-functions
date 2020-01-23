const { Model, DataTypes } = require('sequelize');

class LatLong extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            latitude: DataTypes.DOUBLE,
            longitude: DataTypes.DOUBLE
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Grupo, { foreignKey: 'grupoId', as: 'grupo_latlong' });                
    }
}

module.exports = LatLong;