'use strict'
module.exports = (sequelize, DataTypes) => {
  var role = sequelize.define('role', {
    name: DataTypes.STRING
  })
  return role
}