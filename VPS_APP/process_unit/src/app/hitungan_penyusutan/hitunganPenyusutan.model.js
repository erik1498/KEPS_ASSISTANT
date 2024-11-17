import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const HitunganPenyusutanModel = db.define("hitungan_penyusutan_tab",
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        daftar_aset: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        transaksi: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        metode_penyusutan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        tahun_perolehan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        tanggal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        bulan: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        masa_awal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        masa_akhir: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        harga_beli: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_buku: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_penyusutan: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        persentase: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        akumulasi_penyusutan_awal_tahun: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        persentase_penyusutan: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_buku_awal_tahun: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        nilai_buku_akhir_tahun: {
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

export default HitunganPenyusutanModel