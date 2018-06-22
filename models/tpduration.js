'use strict';
module.exports = (sequelize, DataTypes) => {
  var tpDuration = sequelize.define('tpDuration', {
    day: DataTypes.INTEGER,
    night: DataTypes.INTEGER,
    tpId: DataTypes.INTEGER
  });

  return tpDuration;
};