import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const {DataTypes} = Sequelize;

const StatusRiwayatAktivitasDokumenModel = db.define("status_riwayat_aktivitas_dokumen_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        riwayat_aktivitas_dokumen: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        judul_status: {
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
        }
    }), {
        freezeTableName: true
    }
)

export default StatusRiwayatAktivitasDokumenModel