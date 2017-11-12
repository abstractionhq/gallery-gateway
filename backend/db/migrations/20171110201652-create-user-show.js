export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('user_shows', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      primaryKey: true
    },
    showId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'shows', key: 'id' },
      primaryKey: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  })
}

export function down (queryInterface) {
  return queryInterface.dropTable('user_show')
}
