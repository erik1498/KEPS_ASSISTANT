import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const PenyesuaianPersediaanModel = db.define("penyesuaian_persediaan_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        tanggal: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        perintah_stok_opname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        hasil_stok_opname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kuantitas: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        stok_tersedia_sistem: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        tipe_penyesuaian: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        jumlah: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        keterangan: {
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

export default PenyesuaianPersediaanModel