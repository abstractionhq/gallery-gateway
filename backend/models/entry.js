import Image from './image'
import Video from './video'
import Other from './other'
import Group from './group'
import User from './user'
import Vote from './vote'
import SinglePiece from './singlePiece'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'

const Entry = sequelize.define('entry', {
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
  pieceId: {
    allowNull: false,
    type: DataTypes.INTEGER
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

/*
* Calculate the score on the entry
*/
Entry.prototype.getScore = function getScore () {
  // Calculate score by getting all votes with this
  // entry id and then averaging over the sum of the votes
  return Vote.findAll({ where: { entryId: this.id } })
    .then((votes) => {
      const votesValues = votes.map(vote => vote.value)
      if (votesValues.length === 0) {
        return 0
      }
      return votesValues.reduce((acc, curr) => acc + curr) / votesValues.length
    })
}

Entry.prototype.getGroup = function getGroup () {
  if (!this.isGroupSubmission()) {
    return Promise.resolve(null)
  }
  return Group.findById(this.groupId)
}

Entry.prototype.getStudent = function getUser () {
  if (!this.isStudentSubmission()) {
    return Promise.resolve(null)
  }
  return User.findById(this.studentUsername)
}

Entry.prototype.getSinglePiece = function getSinglePiece() {
  return SinglePiece.findById(this.pieceId);
};

Entry.prototype.isGroupSubmission = function () {
  return Number.isInteger(this.groupId)
}

Entry.prototype.isStudentSubmission = function () {
  return !!this.studentUsername
}

export default Entry
