'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = (models) => {
    User.belongsTo(models.User_role, {
      foreignKey: 'roleId',
      as: 'roleDetail',
      onDelete: 'CASCADE'
    })
  }

  return User;
};