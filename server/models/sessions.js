'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sessions = sequelize.define('Sessions', {
    sid: DataTypes.STRING,
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Sessions;
};