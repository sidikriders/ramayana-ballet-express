'use strict';
module.exports = (sequelize, DataTypes) => {
  var tag = sequelize.define('tag', {
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING
  })

  tag.associate = (models) => {
    tag.belongsToMany(models.attraction, {
      through: 'tag_attraction',
      as: 'attractionList'
    })
  }

  return tag;
};