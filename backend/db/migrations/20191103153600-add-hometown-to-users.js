export function up (queryInterface, Sequelize) {
  return queryInterface.addColumn(
    'users', // Table name
    'hometown', // attribute
    {
      type: Sequelize.STRING,
      allowNull: true,
    }
  )
}

export function down (queryInterface) {
  return queryInterface.removeColumn('users', 'hometown')
}
