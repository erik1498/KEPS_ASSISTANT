import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const RincianReturPembelianBarangModel = db.define("rincian_retur_pembelian_barang_tab",
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        retur_pembelian_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        rincian_pesanan_pembelian_barang: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        jumlah: {
            type: DataTypes.INTEGER,
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
        sudah_dibayar: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        retur_sebelum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        retur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_retur_sebelum: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_retur: {
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

export default RincianReturPembelianBarangModel