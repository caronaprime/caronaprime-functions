'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LatLongs', {
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
      latitude:{
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      longitude:{
        type: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('LatLongs');

  }
};
