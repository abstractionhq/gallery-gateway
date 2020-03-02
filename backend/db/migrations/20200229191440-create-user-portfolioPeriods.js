'use strict';

export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('user_portfolioPeriods', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'users', key: 'username' },
      primaryKey: true
    },
    portfolioPeriodId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'portfolioPeriods', key: 'id' },
      primaryKey: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })
}

export function down (queryInterface) {
  return queryInterface.dropTable('user_portfolioPeriods')
}
