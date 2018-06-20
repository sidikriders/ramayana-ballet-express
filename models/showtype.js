'use strict';
module.exports = (sequelize, DataTypes) => {
  var showType = sequelize.define('showType', {
    name: DataTypes.STRING,
    seatMap: DataTypes.STRING
  });

  showType.associate = (models) => {
    showType.hasMany(models.showImage)
    showType.hasMany(models.showPriceList)
    showType.hasMany(models.seatList)
  }

  return showType;
};