import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const RincianPelunasanPenjualanDendaBarangModel = db.define("rincian_pelunasan_penjualan_denda_barang_tab",
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        pelunasan_penjualan_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        rincian_pesanan_penjualan_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        hari_terlewat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        total_denda: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        denda_sudah_dibayar: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        piutang_denda: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_pelunasan: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default RincianPelunasanPenjualanDendaBarangModel