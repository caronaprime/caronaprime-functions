'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Locais', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      latitude:{
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      longitude:{
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      placeId:{
        type: Sequelize.STRING,        
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
    return queryInterface.dropTable('Locais');
  }
};
