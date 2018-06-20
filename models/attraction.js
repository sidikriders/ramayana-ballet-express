'use strict';
module.exports = (sequelize, DataTypes) => {
  var attraction = sequelize.define('attraction', {
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    shortDesc: DataTypes.STRING,
    shortDescEn: DataTypes.STRING,
    desc: DataTypes.STRING,
    descEn: DataTypes.STRING,
    attractionGroupId: DataTypes.INTEGER
  });

  attraction.associate = (models) => {
    attraction.belongsTo(models.attractionGroup)
    attraction.hasMany(models.attractionImage)
    attraction.belongsToMany(models.tag, {
      through: 'tag_attraction',
      as: 'tags'
    })
  }

  return attraction;
};