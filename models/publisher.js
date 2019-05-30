'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {});
  publisher.associate = function(models) {
    publisher.belongsToMany(models.act, {
      through: models.act_publisher
    });
  };
  return publisher;
};
