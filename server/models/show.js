'use strict';
module.exports = (sequelize, DataTypes) => {
  var Show = sequelize.define('Show', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    image: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Show;
};