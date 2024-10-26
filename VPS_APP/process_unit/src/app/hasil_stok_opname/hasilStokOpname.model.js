import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const HasilStokOpnameModel = db.define("hasil_stok_opname_tab", 
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
        perintah_stok_opname: {
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
        kuantitas: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
    }), {
    freezeTableName: true
}
)

export default HasilStokOpnameModel