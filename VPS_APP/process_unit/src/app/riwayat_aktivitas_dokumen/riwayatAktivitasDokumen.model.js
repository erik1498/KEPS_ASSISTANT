import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const {DataTypes} = Sequelize;

const RiwayatAktivitasDokumenModel = db.define("riwayat_aktivitas_dokumen_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        aktivitas_dokumen: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        judul_aktivitas: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        tanggal: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        enabled: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
    }), {
        freezeTableName: true
    }
)

export default RiwayatAktivitasDokumenModel