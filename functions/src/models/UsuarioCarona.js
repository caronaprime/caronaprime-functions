const { Model, DataTypes } = require('sequelize');

class UsuarioCarona extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario);
        this.belongsTo(models.Carona);
    }
}

module.exports = UsuarioCarona;