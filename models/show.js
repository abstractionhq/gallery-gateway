import DataTypes from 'sequelize';
import sequelize from '../config/sequelize';

export default sequelize.define('show', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        notEmpty: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",        
    }, 
    entryCap: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        min: 1,
    },
    entryStart: {
        type: DataTypes.DATE,    
        allowNull: false,         
    },
    entryEnd: {
        type: DataTypes.DATE,  
        allowNull: false,         
    },   
    judgingStart: {
        type: DataTypes.DATE, 
        allowNull: false,         
    },
    judgingEnd: {
        type: DataTypes.DATE,  
        allowNull: false,         
    },
},
{
    validate: {
        entryAndJudingDateValidation() {
            const entryStart = new Date(this.entryStart);
            const entryEnd = new Date(this.entryEnd);
            const judgingStart = new Date(this.judgingStart);
            const judgingEnd = new Date(this.judgingEnd);

            if (entryStart > entryEnd) {
                throw new Error('Entry start date must be before the entry end date');                
            } else if (entryEnd >= judgingStart) {
                throw new Error('Entry end date must be before or equal to the judging start date');
            } else if (judgingStart > judgingEnd) {
                throw new Error('Judging start date must be before the judging end date');
            }
        }
    },
},

)