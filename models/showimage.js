'use strict';
module.exports = (sequelize, DataTypes) => {
  var showImage = sequelize.define('showImage', {
    url: DataTypes.STRING,
    showTypeId: DataTypes.INTEGER
  })

  showImage.associate = (models) => {
    showImage.belongsTo(models.showType)
  }

  return showImage
};