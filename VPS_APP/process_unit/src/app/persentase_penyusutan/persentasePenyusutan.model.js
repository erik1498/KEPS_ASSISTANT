import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const PersentasePenyusutanModel = db.define("persentase_penyusutan_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        metode_penyusutan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kelompok_aset: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        persentase: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default PersentasePenyusutanModel