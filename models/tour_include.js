'use strict';
module.exports = (sequelize, DataTypes) => {
  var tour_include = sequelize.define('tour_include', {
    tourPackageId: DataTypes.INTEGER,
    attractionId: DataTypes.INTEGER
  })

  return tour_include;
};