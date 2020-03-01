import DataTypes from "sequelize";
import sequelize from "../config/sequelize";

const Scholarship = sequelize.define("scholarship", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  gpa: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  yearStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requiredPhotos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fulltime: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  renewable: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  requiresEssay: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  degreePrograms: {
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
});

export default Scholarship;
