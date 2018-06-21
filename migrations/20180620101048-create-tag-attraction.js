'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tag_attractions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attractionId: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'attraction',
          key: 'id'
        }
      },
      tagId: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'tag',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tag_attractions');
  }
};