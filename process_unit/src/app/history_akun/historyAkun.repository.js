import { Sequelize } from "sequelize";
import db from "../../config/Database.js";

export const getHistoryAkunByUuidAndBulanRepo = async (uuid, bulan, tahun, search) => {
    const historyAkun = await db.query(
        `
            SELECT 
                res.*
            FROM
            (
                SELECT 
                    jut.uuid,
                    jut.bukti_transaksi,
                    jut.tanggal,
                    jut.bulan,
                    jut.tahun,
                    jut.waktu,
                    jut.debet,
                    jut.kredit,
                    kapt.code AS kode_akun,
                    kapt.name AS nama_akun,
                    kapt.type AS type_akun,
                    jut.uraian,
                    "JURNAL UMUM" AS sumber,
                    jut.enabled
                FROM jurnal_umum_tab jut
                JOIN kode_akun_perkiraan_tab kapt ON kapt.uuid = jut.kode_akun_uuid
                WHERE kapt.enabled = 1 AND jut.enabled = 1
                AND jut.uraian LIKE '%${search}%'
            ) AS res
            JOIN kode_akun_perkiraan_tab kapt ON kapt.code = res.kode_akun
            WHERE res.bulan = "${bulan}" AND res.tahun = "${tahun}"
            AND kapt.uuid = "${uuid}"
            ORDER BY res.tahun ASC, res.bulan ASC, res.tanggal ASC, res.waktu ASC
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return historyAkun
}