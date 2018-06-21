'use strict';
module.exports = (sequelize, DataTypes) => {
  var attractionImage = sequelize.define('attractionImage', {
    title: DataTypes.STRING,
    titleEn: DataTypes.STRING,
    url: DataTypes.STRING,
    attractionId: DataTypes.INTEGER
  })

  attractionImage.associate = (models) => {
    attractionImage.belongsTo(models.attraction)
  }

  return attractionImage;
};