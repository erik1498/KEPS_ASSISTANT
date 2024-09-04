import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const {DataTypes} = Sequelize;

const RiwayatPembayaranAktivitasDokumenModel = db.define("riwayat_pembayaran_aktivitas_dokumen_tab", 
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
        tanggal: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        nilai_pembayaran: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        pegawai_penerima: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        nomor_kwitansi_tanda_terima: {
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

export default RiwayatPembayaranAktivitasDokumenModel