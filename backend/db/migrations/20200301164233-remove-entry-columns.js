'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('entries', 'title'),
      queryInterface.removeColumn('entries', 'comment'),
      queryInterface.removeColumn('entries', 'entryType'),
      queryInterface.removeColumn('entries', 'entryId')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('entries', 'title', Sequelize.STRING,
          {
            defaultValue: 'Untitled',
            allowNull: false
          }),
      queryInterface.addColumn('entries', 'comment', Sequelize.TEXT),
      queryInterface.addColumn('entries', 'entryType', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
        //default value needed since we have no entry to add here
      }),
      queryInterface.addColumn('entries', 'entryId', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
      })
    ])
  }
};
