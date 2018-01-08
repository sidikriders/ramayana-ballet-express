'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.UserRole, {
      foreignKey: 'role'
    })
  }

  return User;
};