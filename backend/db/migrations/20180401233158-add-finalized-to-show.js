export function up (queryInterface, Sequelize) {
  return queryInterface.addColumn(
    'shows', // Table name
    'finalized', // attribute
    {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  )
}

export function down (queryInterface) {
  return queryInterface.removeColumn('shows', 'finalized')
}
