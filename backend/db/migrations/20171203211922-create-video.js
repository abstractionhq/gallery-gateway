export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('videos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    videoId: {
      type: Sequelize.STRING,
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
  return queryInterface.dropTable('videos')
}
