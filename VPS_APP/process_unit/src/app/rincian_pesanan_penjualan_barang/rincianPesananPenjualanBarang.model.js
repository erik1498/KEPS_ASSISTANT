import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const RincianPesananPenjualanBarangModel = db.define("rincian_pesanan_penjualan_barang_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        pesanan_penjualan_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kategori_harga_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        stok_awal_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kode_harga_customer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        jumlah: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        harga: {
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
        diskon_angka: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        diskon_persentase: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        total_harga: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default RincianPesananPenjualanBarangModel