const { Model, DataTypes } = require('sequelize');

class OfertaCarona extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            portaMalasLivre: DataTypes.BOOLEAN,
            carroAdaptado: DataTypes.BOOLEAN,
            hora: DataTypes.INTEGER,
            minuto: DataTypes.INTEGER,
            totalVagas: DataTypes.INTEGER,
            domingo: DataTypes.BOOLEAN,
            segunda: DataTypes.BOOLEAN,
            terca: DataTypes.BOOLEAN,
            quarta: DataTypes.BOOLEAN,
            quinta: DataTypes.BOOLEAN,
            sexta: DataTypes.BOOLEAN,
            sabado: DataTypes.BOOLEAN,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Grupo, { foreignKey: 'grupoId', as: 'ofertaCaronaGrupos' });
        this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'ofertaUsuarios' });
    }
}

module.exports = OfertaCarona;