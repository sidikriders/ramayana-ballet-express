'use strict';
module.exports = (sequelize, DataTypes) => {
  var tag_attraction = sequelize.define('tag_attraction', {
    attractionId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  })

  return tag_attraction;
};