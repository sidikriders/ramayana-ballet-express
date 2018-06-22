'use strict';
module.exports = (sequelize, DataTypes) => {
  var tour_attraction = sequelize.define('tour_attraction', {
    tourPackageId: DataTypes.INTEGER,
    attractionId: DataTypes.INTEGER
  })

  return tour_attraction;
};