'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('act_forms', {
      act_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'acts',
          key: 'act_id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      form_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'forms',
          key: 'form_id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('act_forms');
  }
};
