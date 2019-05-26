'use strict';
module.exports = (sequelize, DataTypes) => {
  const act = sequelize.define('act', {
    name: DataTypes.STRING,
    text: DataTypes.TEXT,
    act_nubmer: DataTypes.STRING,
    reg_nubmer: DataTypes.STRING,
    act_code: DataTypes.STRING,
    adoption_start_date: DataTypes.DATE,
    adoption_end_date: DataTypes.DATE,
    reg_start_date: DataTypes.DATE,
    reg_end_date: DataTypes.DATE,
    register_entry_start_date: DataTypes.DATE,
    register_entry_end_date: DataTypes.DATE
  }, {});
  act.associate = function(models) {
    act.belongsToMany(models.country, {
      through: models.act_country
    });
    act.belongsToMany(models.form, {
      through: models.act_form
    });
    act.belongsToMany(models.publisher, {
      through: models.act_publisher
    });
    act.belongsToMany(models.status, {
      through: models.act_status
    });
  };
  return act;
};
