'use strict';
module.exports = (sequelize, DataTypes) => {
  const status = sequelize.define('status', {
    name: DataTypes.STRING
  }, {});
  status.associate = function(models) {
    status.belongsToMany(models.act, {
      through: models.act_status
    });
  };
  return status;
};
