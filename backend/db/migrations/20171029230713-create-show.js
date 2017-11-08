export function up (queryInterface, Sequelize) {
  return queryInterface.createTable('shows', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    entryCap: {
      type: Sequelize.INTEGER,
      allowNull: false,
      min: 1
    },
    entryStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    entryEnd: {
      type: Sequelize.DATE,
      allowNull: false
    },
    judgingStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    judgingEnd: {
      type: Sequelize.DATE,
      allowNull: false
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
  return queryInterface.dropTable('shows')
}
