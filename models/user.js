import DataTypes from 'sequelize';
import sequelize from '../config/sequelize';
import { STUDENT, ADMIN, JUDGE } from '../permissionLevels'
const UserType = sequelize

export default sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,        
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false, 
        notEmpty: true,        
    }, 
    lastName: {
        type: DataTypes.STRING,
        allowNull: false, 
        notEmpty: true,        
    },
    displayName: {
        type: DataTypes.STRING,        
    },
    type: {
        type: DataTypes.ENUM(STUDENT, ADMIN, JUDGE),
        allowNull: false,
        notEmpty: true,
    }
})