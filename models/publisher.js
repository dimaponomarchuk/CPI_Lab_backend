'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    name: DataTypes.STRING
  }, {});
  publisher.associate = function(models) {
    publisher.belongsToMany(models.act, {
      through: models.act_publisher
    });
  };
  return publisher;
};
