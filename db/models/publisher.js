'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  publisher.associate = function(models) {
    publisher.hasOne(models.act, {
      foreignKey: 'act_id'
    });
  };
  return publisher;
};
