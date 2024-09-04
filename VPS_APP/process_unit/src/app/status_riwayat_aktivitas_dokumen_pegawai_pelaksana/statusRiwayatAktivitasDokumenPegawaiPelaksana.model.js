import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const {DataTypes} = Sequelize;

const StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel = db.define("status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        status_riwayat_aktivitas_dokumen: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        pegawai_pelaksana: {
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

export default StatusRiwayatAktivitasDokumenPegawaiPelaksanaModel