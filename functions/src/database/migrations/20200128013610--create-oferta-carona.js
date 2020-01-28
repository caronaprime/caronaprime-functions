'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OfertaCaronas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      grupoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Grupos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      hora: {
        type: Sequelize.TIME,
        allowNull: false
      },
      totalVagas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      portaMalasLivre: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      carroAdaptado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      domingo:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      segunda:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      terca:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      quarta:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      quinta:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sexta:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sabado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OfertaCaronas');
  }
};

