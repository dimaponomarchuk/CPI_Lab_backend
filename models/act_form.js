'use strict';
module.exports = (sequelize, DataTypes) => {
  const act_form = sequelize.define('act_form', {
    act_id: DataTypes.INTEGER,
    form_id: DataTypes.INTEGER
  }, {});
  act_form.associate = function(models) {
    // associations can be defined here
  };
  return act_form;
};