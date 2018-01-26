export function up (queryInterface, Sequelize) {
  return queryInterface.addColumn(
    'groups',
    'participants',
    {
      allowNull: false,
      type: Sequelize.STRING
    }
  ).then(() => {
    queryInterface.addColumn(
      'groups',
      'creatorUsername',
      {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'username'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    )
  })
}

export function down (queryInterface) {
  return queryInterface.removeColumn('groups', 'participants')
    .then(() => queryInterface.removeColumn('groups', 'creatorUsername'))
}
