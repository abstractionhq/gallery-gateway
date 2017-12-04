import Entry from './entry'
import { VIDEO_ENTRY, ALLOWED_VIDEO_PROVIDERS } from '../constants'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

export default sequelize.define('video', {
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  }
},
{
  instanceMethods: {
    getEntry () {
      return Entry.findOne({
        where: {entryType: VIDEO_ENTRY, entryId: this.id}
      })
    }
  },
  validate: {
    allowed_provider () {
      if (!ALLOWED_VIDEO_PROVIDERS.has(this.provider)) {
        throw new Error('video source must be from youtube or vimeo')
      }
    }
  }
})
