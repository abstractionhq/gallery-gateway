import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'

const Portfolio = sequelize.define('portfolio', {
      portfolioPeriodId: {
        type: DataTypes.INTEGER,
        references: {
          model: "portfolioPeriods",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      studentUsername: {
        type: DataTypes.STRING,
        references: {
          model: "users",
          key: "username"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      yearLevel: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      academicProgram: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      submitted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
  })
  
  export default Portfolio
  