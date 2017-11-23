export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('images', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    path: {
      type: Sequelize.STRING
    },
    horizDimInch: {
      type: Sequelize.FLOAT
    },
    vertDimInch: {
      type: Sequelize.FLOAT
    },
    mediaType: {
      type: Sequelize.STRING
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
  return queryInterface.dropTable('images')
}
