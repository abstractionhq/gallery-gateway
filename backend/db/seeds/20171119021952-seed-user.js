export function up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('users', [
    {
      username: 'user1',
      firstName: 'Clark',
      lastName: 'Kent',
      type: 'ADMIN'
    },
    {
      username: 'user2',
      firstName: 'Jane',
      lastName: 'Doe',
      type: 'ADMIN'
    },
    {
      username: 'user3',
      firstName: 'Mark',
      lastName: 'Brown',
      type: 'JUDGE'
    },
    {
      username: 'user4',
      firstName: 'Sally',
      lastName: 'Smith',
      type: 'JUDGE'
    },
    {
      username: 'user5',
      firstName: 'Fred',
      lastName: 'Rogers',
      type: 'STUDENT'
    },
    {
      username: 'user6',
      firstName: 'Roberta',
      lastName: 'Jenkins',
      type: 'STUDENT'
    }
  ])
}

export function down (queryInterface) {
  return queryInterface.bulkDelete('users', null)
}