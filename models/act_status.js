'use strict';
module.exports = (sequelize, DataTypes) => {
  const act_status = sequelize.define('act_status', {
    act_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {});
  act_status.associate = function(models) {
    // associations can be defined here
  };
  return act_status;
};