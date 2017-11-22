export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('entries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    showId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'shows',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    studentUsername: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'username'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    groupId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'groups',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
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
    invited: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    yearLevel: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    academicProgram: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    excludeFromJudging: {
      allowNull: false,
      type: Sequelize.BOOLEAN
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
