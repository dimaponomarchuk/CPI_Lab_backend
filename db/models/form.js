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
    form.belongsTo(models.act);
  };
  return form;
};
