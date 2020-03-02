import Entry from './entry'
import { IMAGE_ENTRY } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import SinglePiece from './singlePiece'

const Image = sequelize.define('image', {
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  horizDimInch: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  vertDimInch: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  mediaType: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
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
    dimensionsPositiveValidation () {
      if (this.vertDimInch <= 0) {
        throw new Error('vertDimInch must be positive')
      }
      if (this.horizDimInch <= 0) {
        throw new Error('horizDimInch must be positive')
      }
    }
  }
})

Image.prototype.getEntry = function getEntry () {
  return SinglePiece.findOne({where: {pieceType: IMAGE_ENTRY, pieceId: this.id}})
  .then(singlePiece => singlePiece.getEntry())
}

export default Image
