import Image from './image'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

const IMAGE = 3
export const IMAGE_ENTRY = IMAGE

const VIDEO = 4
export const VIDEO_ENTRY = VIDEO

const OTHER = 5
export const OTHER_ENTRY = OTHER

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
  if (this.entryType !== IMAGE) {
    return Promise.resolve(null)
  }
  return Image.findOne({
    where: {id: this.entryId}
  })
}

export default Entry
