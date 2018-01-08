'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShowType = sequelize.define('ShowType', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    seatingList: {
      type: DatatTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    }
  });

  ShowType.associate = (models) => {
    ShowType.belongsTo(models.User, {
      foreignKey: 'createdBy'
    })

    ShowType.belongsTo(models.User, {
      foreignKey: 'updatedBy'
    })
  }

  return ShowType;
};