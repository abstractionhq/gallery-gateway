import Image from './image'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { IMAGE_ENTRY } from '../constants'

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
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  },
  moreCopies: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  forSale: {
    allowNull: false,
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
})

/*
 * Gets the associated photo as a Promise
 */
Entry.prototype.getImage = function getImage () {
  if (this.entryType !== IMAGE_ENTRY) {
    return Promise.resolve(null)
  }
  return Image.findOne({
    where: {id: this.entryId}
  })
}

export default Entry
