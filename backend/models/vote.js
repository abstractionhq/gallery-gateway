import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { ALLOWED_VOTE_VALUES } from '../constants'

export default sequelize.define('vote', {
  judgeUsername: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},
{
  validate: {
    voteValueValidation () {
      if(!ALLOWED_VOTE_VALUES.has(this.value)){
        throw new Error(`Vote value must be 0, 1, or 2`)
      }
    }
  }
})