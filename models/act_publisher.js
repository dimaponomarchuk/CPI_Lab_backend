'use strict';
module.exports = (sequelize, DataTypes) => {
  const act_publisher = sequelize.define('act_publisher', {
    act_id: DataTypes.INTEGER,
    publisher_id: DataTypes.INTEGER
  }, {});
  act_publisher.associate = function(models) {
    // associations can be defined here
  };
  return act_publisher;
};