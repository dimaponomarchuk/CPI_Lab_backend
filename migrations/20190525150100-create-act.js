'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('acts', {
      act_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      act_nubmer: {
        type: Sequelize.STRING
      },
      reg_nubmer: {
        type: Sequelize.STRING
      },
      act_code: {
        type: Sequelize.STRING
      },
      adoption_start_date: {
        type: Sequelize.DATE
      },
      adoption_end_date: {
        type: Sequelize.DATE
      },
      reg_start_date: {
        type: Sequelize.DATE
      },
      reg_end_date: {
        type: Sequelize.DATE
      },
      register_entry_start_date: {
        type: Sequelize.DATE
      },
      register_entry_end_date: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('acts');
  }
};
