'use strict';
module.exports = (sequelize, DataTypes) => {
  var showPriceList = sequelize.define('showPriceList', {
    showTypeId: DataTypes.INTEGER,
    priceType: DataTypes.STRING,
    price: DataTypes.INTEGER
  });

  showPriceList.associates = (models) => {
    showPriceList.belongsTo(models.showType)
  }

  return showPriceList;
};