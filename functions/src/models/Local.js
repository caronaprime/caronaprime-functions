const { Model, DataTypes } = require('sequelize');

class Local extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: DataTypes.STRING,
            latitude: DataTypes.DOUBLE,
            longitude: DataTypes.DOUBLE,
            placeId: DataTypes.STRING,
        }, {
            tableName: 'Locais',
            sequelize
        })
    }

}

module.exports = Local;