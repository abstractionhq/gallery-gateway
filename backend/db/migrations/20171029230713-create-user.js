import { STUDENT, ADMIN, JUDGE } from '../../permissionLevels'

export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('users', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    displayName: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.ENUM(STUDENT, ADMIN, JUDGE),
      allowNull: false,
      notEmpty: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
}

export function down (queryInterface) {
  return queryInterface.dropTable('users')
}
