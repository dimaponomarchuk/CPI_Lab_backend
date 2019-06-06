'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rights: DataTypes.INTEGER(11)
  }, {});
  user.associate = function(models) {
  };
  return user;
};
