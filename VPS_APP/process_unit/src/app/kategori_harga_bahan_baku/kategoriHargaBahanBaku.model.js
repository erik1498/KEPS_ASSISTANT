import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const KategoriHargaBahanBakuModel = db.define("kategori_harga_bahan_baku_tab", 
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
        kode_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        satuan_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        harga_beli: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        }
    }), {
    freezeTableName: true
}
)

export default KategoriHargaBahanBakuModel