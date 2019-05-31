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
      publisher_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'publishers',
          key: 'publisher_id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      form_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'forms',
          key: 'form_id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'statuses',
          key: 'status_id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      },
      country_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'countries',
          key: 'country_id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
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
