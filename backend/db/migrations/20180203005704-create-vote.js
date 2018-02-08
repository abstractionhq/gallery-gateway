export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('votes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    judgeUsername: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    entryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'entries',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'    
  },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
  return queryInterface.dropTable('votes')
}