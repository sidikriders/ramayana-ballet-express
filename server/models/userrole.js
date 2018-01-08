'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserRole = sequelize.define('UserRole', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  return UserRole;
};