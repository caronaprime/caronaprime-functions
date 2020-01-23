const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Grupo = require('../models/Grupo');
const Usuario = require('../models/Usuario');
const Local = require('../models/Local');
const LatLong = require('../models/LatLong');
const MembroGrupo = require('../models/MembroGrupo');

const connection = new Sequelize(dbConfig);

Local.init(connection);
Grupo.init(connection);
Usuario.init(connection);
LatLong.init(connection);
MembroGrupo.init(connection);

Grupo.associate(connection.models);
LatLong.associate(connection.models);
MembroGrupo.associate(connection.models);

module.exports = connection;