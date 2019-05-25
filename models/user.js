'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};