export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('user_shows', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      references: { model: 'users', key: 'username' },
      primaryKey: true
    },
    showId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'shows', key: 'id' },
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
  return queryInterface.dropTable('user_show')
}
