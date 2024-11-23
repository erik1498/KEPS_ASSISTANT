import { Sequelize } from "sequelize";
import db, { defaultModelBuilder } from "../../config/Database.js";

const { DataTypes } = Sequelize;

const KategoriAsetModel = db.define("kategori_aset_tab", 
    defaultModelBuilder({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty:true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kode_akun_perkiraan_debet: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty:true,
            }
        },
        kode_akun_perkiraan_kredit: {
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

export default KategoriAsetModel