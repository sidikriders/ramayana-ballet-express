'use strict';
module.exports = (sequelize, DataTypes) => {
  var seatList = sequelize.define('seatList', {
    showTypeId: DataTypes.INTEGER,
    row: DataTypes.INTEGER,
    column: DataTypes.STRING
  })

  seatList.associate = (models) => {
    seatList.belongsTo(models.showType)
  }

  return seatList;
};