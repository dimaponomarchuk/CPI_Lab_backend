'use strict';
module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  country.associate = function(models) {
    country.belongsTo(models.act);
  };
  return country;
};
