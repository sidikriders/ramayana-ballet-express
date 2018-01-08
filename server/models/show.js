'use strict';
module.exports = (sequelize, DataTypes) => {
  var Show = sequelize.define('Show', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: Datatypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Show.associate = (models) => {
    Show.belongsTo(models.ShowType, {
      foreignKey: 'showType'
    })

    Show.belongsTo(models.User, {
      foreignKey: 'createdBy'
    })

    Show.belongsTo(models.User, {
      foreignKey: 'updatedBy'
    })
  }

  return Show;
};