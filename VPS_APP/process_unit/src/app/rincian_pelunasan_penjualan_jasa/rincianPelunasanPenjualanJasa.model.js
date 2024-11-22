import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const RincianPelunasanPenjualanJasaModel = db.define("rincian_pelunasan_penjualan_jasa_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        pelunasan_penjualan_jasa: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        rincian_pesanan_penjualan_jasa: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        sudah_dibayar: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        piutang: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        nilai_pelunasan: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default RincianPelunasanPenjualanJasaModel