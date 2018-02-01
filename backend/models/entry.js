import Image from './image'
import Video from './video'
import Other from './other'
import Group from './group'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'

const Entry = sequelize.define('entry', {
  showId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  studentUsername: {
    allowNull: true,
    type: DataTypes.STRING
  },
  groupId: {
    allowNull: true,
    type: DataTypes.INTEGER
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
    type: DataTypes.BOOLEAN,
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
 * Gets the associated photo as a Promise
 */
Entry.prototype.getImage = function getImage () {
  if (this.entryType !== IMAGE_ENTRY) {
    return Promise.resolve(null)
  }
  return Image.findOne({ where: {id: this.entryId} })
}

Entry.prototype.getVideo = function getVideo () {
  if (this.entryType !== VIDEO_ENTRY) {
    return Promise.resolve(null)
  }
  return Video.findOne({ where: {id: this.entryId} })
}

Entry.prototype.getOther = function getOther () {
  if (this.entryType !== OTHER_ENTRY) {
    return Promise.resolve(null)
  }
  return Other.findOne({ where: {id: this.entryId} })
}

Entry.prototype.getGroup = function getGroup () {
  if (this.groupId === null || this.groupId === undefined) {
    // the above oddness is due to the fact that groupId == 0 is valid
    return Promise.resolve(null)
  }
  return Group.findById(this.groupId)
}

export default Entry
