import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const KonversiBarangModel = db.define("konversi_barang_tab", 
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
        kode_konversi_barang: {
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
        satuan_barang: {
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

export default KonversiBarangModel