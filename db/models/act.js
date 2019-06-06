'use strict';
module.exports = (sequelize, DataTypes) => {
  const act = sequelize.define('act', {
    act_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    publisher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'publishers',
        key: 'publisher_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    form_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'forms',
        key: 'form_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'statuses',
        key: 'status_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    country_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'countries',
        key: 'country_id'
      },
      onUpdate: 'SET NULL',
      onDelete: 'SET NULL'
    },
    name: DataTypes.STRING,
    text: DataTypes.TEXT,
    act_number: DataTypes.STRING,
    reg_number: DataTypes.STRING,
    act_code: DataTypes.STRING,
    adoption_start_date: DataTypes.DATE,
    adoption_end_date: DataTypes.DATE,
    reg_start_date: DataTypes.DATE,
    reg_end_date: DataTypes.DATE,
    register_entry_start_date: DataTypes.DATE,
    register_entry_end_date: DataTypes.DATE
  }, {});
  act.associate = function(models) {
    act.belongsTo(models.status, {
      foreignKey: 'status_id',
    });
    act.belongsTo(models.country, {
      foreignKey: 'country_id',
    });
    act.belongsTo(models.form, {
      foreignKey: 'form_id',
    });
    act.belongsTo(models.publisher, {
      foreignKey: 'publisher_id',
    });
  };
  return act;
};
