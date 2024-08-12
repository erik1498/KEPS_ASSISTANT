import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const {DataTypes} = Sequelize;

const NeracaModel = db.define("neraca_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        json: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        bulan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        tahun: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        }
    }), {
        freezeTableName: true
    }
)

export default NeracaModel