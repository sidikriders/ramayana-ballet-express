'use strict';
module.exports = (sequelize, DataTypes) => {
  var BookStatus = sequelize.define('BookStatus', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  BookStatus.associate = (models) => {
    BookStatus.belongsTo(model.User, {
      foreignKey: 'createdBy'
    })

    BookStatus.belongsTo(model.User, {
      foreignKey: 'updatedBy'
    })
  }

  return BookStatus;
};