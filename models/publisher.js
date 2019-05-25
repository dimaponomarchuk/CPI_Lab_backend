'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    name: DataTypes.STRING
  }, {});
  publisher.associate = function(models) {
    // associations can be defined here
  };
  return publisher;
};