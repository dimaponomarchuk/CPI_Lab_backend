'use strict';
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    name: DataTypes.STRING
  }, {});
  country.associate = function(models) {
    // associations can be defined here
  };
  return country;
};