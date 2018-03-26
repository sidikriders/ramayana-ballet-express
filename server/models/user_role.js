'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_role = sequelize.define('User_role', {
    name: DataTypes.STRING
  })

  User_role.associate = function(models) {
    models.User_role.hasMany(models.User)
  }

  return User_role;
};