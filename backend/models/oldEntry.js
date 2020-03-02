import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

const OldEntry = sequelize.define('entry', {
  showId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'shows',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  studentUsername: {
    allowNull: true,
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'username'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  groupId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  entryType: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  entryId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'Untitled',
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  },
  moreCopies: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN
  },
  forSale: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN
  },
  awardWon: {
    type: DataTypes.TEXT
  },
  invited: {
    allowNull: true,
    type: DataTypes.BOOLEAN
  },
  yearLevel: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  academicProgram: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  excludeFromJudging: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pieceId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
},
{
  validate: {
    entrantPresentValidation () {
      if (!this.studentUsername && !this.groupId) {
        throw new Error('Entry must have an entrant')
      }
    }
  }
})

export default OldEntry