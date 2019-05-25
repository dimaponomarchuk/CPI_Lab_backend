'use strict';
module.exports = (sequelize, DataTypes) => {
  const form = sequelize.define('form', {
    name: DataTypes.STRING
  }, {});
  form.associate = function(models) {
    // associations can be defined here
  };
  return form;
};