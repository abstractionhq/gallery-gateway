export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('entries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    entrantType: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    entrantId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    entryType: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    entryId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT
    },
    moreCopies: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    forSale: {
      allowNull: false,
      type: Sequelize.BOOLEAN
    },
    awardWon: {
      type: Sequelize.TEXT
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
  return queryInterface.dropTable('entries')
}
