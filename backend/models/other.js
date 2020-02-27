import Entry from './entry'
import { OTHER_ENTRY } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

const Other = sequelize.define('other', {
  path: {
    type: DataTypes.STRING,
    allowNull: true
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

Other.prototype.getEntry = function getEntry () {
  return SinglePiece.findOne({where: {pieceType: OTHER_ENTRY, pieceId: this.id}})
  .then(singlePiece => singlePiece.getEntry())
}

export default Other
