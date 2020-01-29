const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: DataTypes.STRING,
            celular: DataTypes.STRING,
            userId: DataTypes.STRING
        }, {
            sequelize
        })
    }
}

module.exports = Usuario;