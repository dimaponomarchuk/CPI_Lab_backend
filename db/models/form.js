'use strict';
module.exports = (sequelize, DataTypes) => {
  const form = sequelize.define('form', {
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  form.associate = function(models) {
    form.hasOne(models.act, {
      foreignKey: 'act_id'
    });
  };
  return form;
};
