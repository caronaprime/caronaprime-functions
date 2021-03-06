const { Model, DataTypes } = require('sequelize');

class Grupo extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nome: DataTypes.STRING
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Local, { foreignKey: 'partidaId', as: 'partidaGrupo' });
        this.belongsTo(models.Local, { foreignKey: 'destinoId', as: 'destinoGrupo' });
        this.hasMany(models.LatLong);
        this.hasMany(models.MembroGrupo);     
        this.hasMany(models.OfertaCarona); 
        this.hasMany(models.Carona);        
    }
}

module.exports = Grupo;