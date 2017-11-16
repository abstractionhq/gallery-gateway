'use strict';
module.exports = (sequelize, DataTypes) => {
  var image = sequelize.define('image', {
    photo: DataTypes.STRING,
    horizDimInch: DataTypes.FLOAT,
    vertDimInch: DataTypes.FLOAT,
    mediaType: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return image;
};