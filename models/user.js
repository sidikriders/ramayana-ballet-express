'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER
  })

  user.associate = (models) => {
    user.belongsTo(models.role)
  }

  return user
}