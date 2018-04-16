export function up (queryInterface, Sequelize) {
  return queryInterface.removeColumn('groups', 'name')
}

export function down (queryInterface, Sequelize) {
  return queryInterface.addColumn(
    'groups',
    'name',
    {
      allowNull: false,
      type: Sequelize.STRING
    }
  )
}
