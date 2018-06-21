'use strict';
module.exports = (sequelize, DataTypes) => {
  var showSchedule = sequelize.define('showSchedule', {
    date: DataTypes.DATE,
    showTypeId: DataTypes.INTEGER
  })

  showSchedule.associate = (models) => {
    showSchedule.belongsTo(models.showType)
  }

  return showSchedule;
};