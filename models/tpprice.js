'use strict';
module.exports = (sequelize, DataTypes) => {
  var tpPrice = sequelize.define('tpPrice', {
    price: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    tpId: DataTypes.INTEGER
  });

  return tpPrice;
};