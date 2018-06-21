'use strict';
module.exports = (sequelize, DataTypes) => {
  var tokenList = sequelize.define('tokenList', {
    token: DataTypes.STRING
  })
  return tokenList
};