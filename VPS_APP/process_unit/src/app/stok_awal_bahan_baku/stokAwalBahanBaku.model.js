import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const StokAwalBahanBakuModel = db.define("stok_awal_bahan_baku_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        daftar_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        daftar_gudang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kategori_harga_bahan_baku: {
            type: DataTypes.STRING,
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

export default StokAwalBahanBakuModel