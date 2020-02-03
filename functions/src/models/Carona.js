const { Model, DataTypes } = require('sequelize');

class Carona extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            data: DataTypes.DATE,
            hora: DataTypes.INTEGER,
            minuto: DataTypes.INTEGER,
            totalVagas: DataTypes.INTEGER,
            portaMalasLivre: DataTypes.BOOLEAN,
            carroAdaptado: DataTypes.BOOLEAN,
            ofertaCaronaId: DataTypes.INTEGER
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Grupo, { foreignKey: 'grupoId', as: 'caronaGrupo' });    
        this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'caronaMotorista' });        
        this.hasMany(models.UsuarioCarona);
    }
}

module.exports = Carona;