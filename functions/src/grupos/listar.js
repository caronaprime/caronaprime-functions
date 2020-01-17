
// Conexão
const db = require('db').asyncConnect()
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = new Sequelize('caronaprime', 'root', 'root', {
    host: '34.68.132.157',
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


class Grupo extends Model { }
Grupo.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING
    },
    partida: {
        type: Sequelize.INTEGER
    },
    destino: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'Grupos',
    timestamps: false,
});

class MembroGrupo extends Model { }
MembroGrupo.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    usuario: {
        type: Sequelize.INTEGER
    },
    grupo: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'MembrosGrupo',
    tableName: 'MembrosGrupo',

    timestamps: false,
});


class Usuario extends Model { }
Usuario.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING
    },
    celular: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'Usuarios',
    tableName: 'Usuarios',

    timestamps: false,
});


class AdministradorGrupo extends Model { }
AdministradorGrupo.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    grupo: {
        type: Sequelize.INTEGER
    },
    usuario: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'AdministradoresGrupo',
    tableName: 'AdministradoresGrupo',

    timestamps: false,
});


class Carona extends Model { }
Carona.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    motorista: {
        type: Sequelize.INTEGER
    },
    vagasDisponiveis: {
        type: Sequelize.INTEGER
    },
    horario: {
        type: Sequelize.TIME
    },
    portaMalaLivre: {
        type: Sequelize.BOOLEAN
    },
    carroAdaptado: {
        type: Sequelize.BOOLEAN
    },
    domingo: {
        type: Sequelize.BOOLEAN
    },
    segunda: {
        type: Sequelize.BOOLEAN
    },
    terca: {
        type: Sequelize.BOOLEAN
    },
    quarta: {
        type: Sequelize.BOOLEAN
    },
    quinta: {
        type: Sequelize.BOOLEAN
    },
    sexta: {
        type: Sequelize.BOOLEAN
    },
    sabado: {
        type: Sequelize.BOOLEAN
    },
    repetirSemanalmente: {
        type: Sequelize.BOOLEAN
    },
}, {
    sequelize,
    modelName: 'Caronas',
    tableName: 'Caronas',

    timestamps: false,
});


class CaronaDisponivel extends Model { }
CaronaDisponivel.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    carona: {
        type: Sequelize.INTEGER
    },
    grupo: {
        type: Sequelize.INTEGER
    },
}, {
    sequelize,
    modelName: 'CaronasDisponiveis',
    tableName: 'CaronasDisponiveis',

    timestamps: false,
});


class Local extends Model { }
Local.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING
    },
    latitude: {
        type: Sequelize.DOUBLE
    },
    longitude: {
        type: Sequelize.DOUBLE
    },
    placeId: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'Locais',
    tableName: 'Locais',

    timestamps: false,
});


class PontoMapa extends Model { }
PontoMapa.init({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    latitude: {
        type: Sequelize.DOUBLE
    },
    longitude: {
        type: Sequelize.DOUBLE
    },
    grupo: {
        type: Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'PontosMapa',
    tableName: 'PontosMapa',

    timestamps: false,
});

const grupo_model = sequelize.define('Grupos');
const membro_grupo_model = sequelize.define('MembrosGrupo');

grupo_model.hasMany(membro_grupo_model);

module.exports = async (req, res) => {
    console.log(Grupo);
    Grupo.findAll().then(grupos => {
        console.log("All users:", JSON.stringify(grupos, null, 4));
    });


    const result = await Grupo.findAll();
    const result2 = await MembroGrupo.findAll();
    const result3 = await Usuario.findAll();
    const result4 = await AdministradorGrupo.findAll();
    const result5 = await Carona.findAll();
    const result6 = await CaronaDisponivel.findAll();
    const result7 = await Local.findAll();
    const result8 = await PontoMapa.findAll();
    res.send({ "success": true, "grupos": result8 });

    // return await db.query(`
    // SELECT a.nome, a.descricao, b.nome AS partida, c.nome AS destino  FROM caronaprime.Grupos a
    //     INNER JOIN caronaprime.Locais b ON a.partida = b.id
    //     INNER JOIN caronaprime.Locais c ON a.destino = c.id;`,
    //     (error, result) => {
    //         if (error) throw error;
    //         console.log(result);

    //         //comentario
    //         res.send({ "success": true, "grupos": result });
    //     });
}
