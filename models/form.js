'use strict';
module.exports = (sequelize, DataTypes) => {
  const form = sequelize.define('form', {
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  form.associate = function(models) {
    form.belongsToMany(models.act, {
      through: models.act_form
    });
  };
  return form;
};
