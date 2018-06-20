'use strict';
module.exports = (sequelize, DataTypes) => {
  var attractionGroup = sequelize.define('attractionGroup', {
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING
  });

  attractionGroup.associate = (models) => {
    attractionGroup.hasMany(models.attraction)
  }

  return attractionGroup;
};