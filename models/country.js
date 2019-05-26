'use strict';
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    name: DataTypes.STRING
  }, {});
  country.associate = function(models) {
    country.belongsToMany(models.act, {
      through: models.act_country
    });
  };
  return country;
};
