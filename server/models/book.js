'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    seatList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.EMAIL,
      allowNull: false
    },
    phoneNumber: DataTypes.STRING,
    company: DataTypes.STRING,
    additionalRequest: DataTypes.STRING
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Show, {
      foreignKey: 'show'
    })

    Book.belongsTo(models.BookStatus, {
      foreignKey: 'status'
    })
  }

  return Book;
};