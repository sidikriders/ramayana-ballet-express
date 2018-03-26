'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_role = sequelize.define('User_role', {
    name: DataTypes.STRING
  })

  User_role.associate = function(models) {
    models.User_role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'userList'
    })
  }

  return User_role;
};