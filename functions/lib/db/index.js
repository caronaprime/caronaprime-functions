/*
    DB - Conexão com o banco de dados MySQL
*/

// Importar bibliotecas
const mysql = require('mysql')
const util = require('util')
const config = require('config')

// Configurações do MySQL
if (!(config &&
    config.sql &&
    config.sql.user &&
    config.sql.password &&
    config.sql.database &&
    config.sql.socketPath)) {
    throw "SQL Error: SQL configuration is not available. Please, enter the settings in config.json file."
}

var mysqlConfig = null;

if (process.env.GCLOUD_PROJECT !== undefined) {
    mysqlConfig = {
        connectionLimit: 1,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database,
        socketPath: config.sql.socketPath
    }
} else {
    mysqlConfig = {
        host: config.sql.host,
        connectionLimit: 1,
        user: config.sql.user,
        password: config.sql.password,
        database: config.sql.database
    }
}

// Módulo
module.exports = {

    // Conectar ao banco de dados
    connect: () => {
        const conn = mysql.createPool(mysqlConfig)
        conn.on('error', function(err) {
            console.error(err)
        })

        return conn
    },

    // Conectar ao banco de dados (síncrono)
    asyncConnect: () => {
        var pool = mysql.createPool(mysqlConfig)
        pool.on('error', function(err) {
            console.error(err)
        })
        pool.query = util.promisify(pool.query)
        return pool
    }

}
