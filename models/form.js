'use strict';
module.exports = (sequelize, DataTypes) => {
  const form = sequelize.define('form', {
    name: DataTypes.STRING
  }, {});
  form.associate = function(models) {
    form.belongsToMany(models.act, {
      through: models.act_form
    });
  };
  return form;
};
