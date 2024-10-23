import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const RincianKonversiBarangModel = db.define("rincian_konversi_barang_tab",
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        konversi_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        stok_awal_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        jumlah_yang_dikonversi: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        stok_awal_barang_tujuan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        jumlah_hasil_konversi_kode_barang_tujuan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default RincianKonversiBarangModel