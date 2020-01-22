'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MembroGrupos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      administrador:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },  
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'      
      },
      grupoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Grupos', key: 'id' },
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
    return queryInterface.dropTable('MembroGrupos');

  }
};
