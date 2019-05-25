'use strict';
module.exports = (sequelize, DataTypes) => {
  const act_country = sequelize.define('act_country', {
    act_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER
  }, {});
  act_country.associate = function(models) {
    // associations can be defined here
  };
  return act_country;
};