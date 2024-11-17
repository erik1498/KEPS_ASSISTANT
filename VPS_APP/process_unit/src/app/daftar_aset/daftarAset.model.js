import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const DaftarAsetModel = db.define("daftar_aset_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        tanggal_beli: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        supplier: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        nomor_invoice: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kuantitas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        satuan_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        harga_satuan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        dpp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        ppn: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        metode_penyusutan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kode_akun_perkiraan: {
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
        kategori_aset: {
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

export default DaftarAsetModel