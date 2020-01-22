'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Grupos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      partidaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Locais', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },      
      destinoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Locais', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    return queryInterface.dropTable('Grupos');

  }
};
