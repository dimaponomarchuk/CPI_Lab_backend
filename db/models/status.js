'use strict';
module.exports = (sequelize, DataTypes) => {
  const status = sequelize.define('status', {
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  status.associate = function(models) {
    status.hasOne(models.act, {
      foreignKey: 'act_id'
    });
  };
  return status;
};
