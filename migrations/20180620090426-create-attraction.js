'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attractions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nameEn: {
        type: Sequelize.STRING
      },
      shortDesc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shortDescEn: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descEn: {
        type: Sequelize.STRING
      },
      attractionGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'attractionGroup',
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
    return queryInterface.dropTable('attractions');
  }
};