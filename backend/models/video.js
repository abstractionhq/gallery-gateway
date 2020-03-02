import Entry from './entry'
import { VIDEO_ENTRY, ALLOWED_VIDEO_PROVIDERS } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

const Video = sequelize.define('video', {
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  videoId: {
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
    allowed_provider () {
      if (!ALLOWED_VIDEO_PROVIDERS.has(this.provider)) {
        throw new Error('Video source must be from youtube or vimeo')
      }
    }
  }
})

Video.prototype.getEntry = function getEntry () {
  return  SinglePiece.findOne({where: {pieceType: OTHER_ENTRY, pieceId: this.id}})
  .then(singlePiece => singlePiece.getEntry())
}

export default Video
