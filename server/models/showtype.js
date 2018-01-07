'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShowType = sequelize.define('ShowType', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    image: DataTypes.STRING,
    seatingList: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ShowType;
};