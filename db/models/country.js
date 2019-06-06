'use strict';
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  country.associate = function(models) {
    country.hasOne(models.act, {
      foreignKey: 'act_id'
    });
  };
  return country;
};
