'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Caronas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ofertaCaronaId:{
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      grupoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Grupos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      motoristaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dataHora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      totalVagas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      portaMalasLivre: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      carroAdaptado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    return queryInterface.dropTable('Caronas');
  }
};

