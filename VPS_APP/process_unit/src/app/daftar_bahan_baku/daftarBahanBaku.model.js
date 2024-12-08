import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const DaftarBahanBakuModel = db.define("daftar_bahan_baku_tab",
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        kategori_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        jenis_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        jenis_penjualan_bahan_baku: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        ppn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default DaftarBahanBakuModel