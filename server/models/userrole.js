'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserRole = sequelize.define('UserRole', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserRole;
};