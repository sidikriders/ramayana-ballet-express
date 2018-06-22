'use strict';
module.exports = (sequelize, DataTypes) => {
  var tourPackage = sequelize.define('tourPackage', {
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    rundown: DataTypes.STRING,
    rundownEn: DataTypes.STRING,
    minPax: DataTypes.INTEGER
  });

  tourPackage.associate = (models) => {
    tourPackage.belongsToMany(models.attraction, {
      through: 'tour_attraction',
      as: 'includes'
    })
    tourPackage.hasOne(models.tpPrice)
    tourPackage.hasOne(models.tpDuration)
  }

  return tourPackage;
};