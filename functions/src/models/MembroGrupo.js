const { Model, DataTypes } = require('sequelize');

class MembroGrupo extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            administrador: {
                type: DataTypes.BOOLEAN,
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Grupo, { foreignKey: 'grupoId', as: 'membroGrupos' });
        this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'membroGruposUsuario' });
    }
}

module.exports = MembroGrupo;