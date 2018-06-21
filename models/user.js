'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  })

  user.associate = (models) => {
    user.belongsTo(models.role)
  }

  return user
}