import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import RiwayatPembayaranAktivitasDokumenModel from "./riwayatPembayaranAktivitasDokumen.model.js";
import { generateDatabaseName, insertQueryUtil, selectOneQueryUtil, updateQueryUtil } from "../../utils/databaseUtil.js";
import { removeDotInRupiahInput } from "../../utils/numberParsingUtil.js";

export const getAllRiwayatPembayaranAktivitasDokumensRepo = async (tahun, req_id) => {
    const riwayatPembayaranAktivitasDokumens = await db.query(
        `
            SELECT 
                adt.no_surat,
                adt.biaya,
                (
                    SELECT
                        GROUP_CONCAT('{"',
                            CONCAT('tanggal":"',rpadt.tanggal, '","nilai_pembayaran":"', rpadt.nilai_pembayaran, '","pegawai_penerima":"', rpadt.pegawai_penerima, '","nomor_kwitansi_tanda_terima":"', rpadt.nomor_kwitansi_tanda_terima, '","aktivitas_dokumen":"', rpadt.aktivitas_dokumen) 
                        ,'"}')
                    FROM ${generateDatabaseName(req_id)}.riwayat_pembayaran_aktivitas_dokumen_tab rpadt 
                    WHERE rpadt.aktivitas_dokumen = adt.uuid 
                    AND adt.enabled = 1
                ) AS list_pembayaran
            FROM ${generateDatabaseName(req_id)}.aktivitas_dokumen_tab adt 
            WHERE adt.enabled = 1
            AND adt.tahun = "${tahun}"
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )
    return riwayatPembayaranAktivitasDokumens
}

export const getAllRiwayatPembayaranAktivitasDokumenRepo = async (aktivitas_dokumen, pageNumber, size, search, req_id) => {
    const riwayatPembayaranAktivitasDokumensCount = await db.query(
        `
            SELECT COUNT(0) AS count FROM ${generateDatabaseName(req_id)}.riwayat_pembayaran_aktivitas_dokumen_tab WHERE aktivitas_dokumen = "${aktivitas_dokumen}" AND nomor_kwitansi_tanda_terima LIKE '%${search}%' AND enabled = 1
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    pageNumber = pageNumber && pageNumber > -1 ? pageNumber : 0
    size = size ? size : riwayatPembayaranAktivitasDokumensCount[0].count

    const riwayatPembayaranAktivitasDokumens = await db.query(
        `
            SELECT * FROM ${generateDatabaseName(req_id)}.riwayat_pembayaran_aktivitas_dokumen_tab WHERE aktivitas_dokumen = "${aktivitas_dokumen}" AND nomor_kwitansi_tanda_terima LIKE '%${search}%' AND enabled = 1 LIMIT ${pageNumber}, ${size}
        `,
        { type: Sequelize.QueryTypes.SELECT }
    )

    return {
        entry: riwayatPembayaranAktivitasDokumens,
        count: riwayatPembayaranAktivitasDokumensCount[0].count,
        pageNumber: pageNumber == 0 ? pageNumber + 1 : (pageNumber / size) + 1,
        size
    }
}

export const getRiwayatPembayaranAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return selectOneQueryUtil(
        generateDatabaseName(req_id),
        RiwayatPembayaranAktivitasDokumenModel,
        null,
        {
            uuid
        }
    )
}

export const createRiwayatPembayaranAktivitasDokumenRepo = async (riwayatPembayaranAktivitasDokumenData, req_id) => {
    riwayatPembayaranAktivitasDokumenData = removeDotInRupiahInput(riwayatPembayaranAktivitasDokumenData, [
        "nilai_pembayaran"
    ])
    return insertQueryUtil(
        generateDatabaseName(req_id),
        RiwayatPembayaranAktivitasDokumenModel,
        {
            aktivitas_dokumen: riwayatPembayaranAktivitasDokumenData.aktivitas_dokumen,
            tanggal: riwayatPembayaranAktivitasDokumenData.tanggal,
            nilai_pembayaran: riwayatPembayaranAktivitasDokumenData.nilai_pembayaran,
            pegawai_penerima: riwayatPembayaranAktivitasDokumenData.pegawai_penerima,
            nomor_kwitansi_tanda_terima: riwayatPembayaranAktivitasDokumenData.nomor_kwitansi_tanda_terima,
            enabled: riwayatPembayaranAktivitasDokumenData.enabled,
        }
    )
}

export const deleteRiwayatPembayaranAktivitasDokumenByUuidRepo = async (uuid, req_id) => {
    return updateQueryUtil(
        generateDatabaseName(req_id),
        RiwayatPembayaranAktivitasDokumenModel,
        {
            enabled: false
        },
        {
            uuid
        }
    )
}

export const updateRiwayatPembayaranAktivitasDokumenByUuidRepo = async (uuid, riwayatPembayaranAktivitasDokumenData) => {
    const riwayatPembayaranAktivitasDokumen = await RiwayatPembayaranAktivitasDokumenModel.update({
        aktivitas_dokumen: riwayatPembayaranAktivitasDokumenData.aktivitas_dokumen,
        tanggal: riwayatPembayaranAktivitasDokumenData.tanggal,
        nilai_pembayaran: riwayatPembayaranAktivitasDokumenData.nilai_pembayaran,
        pegawai_penerima: riwayatPembayaranAktivitasDokumenData.pegawai_penerima,
        nomor_kwitansi_tanda_terima: riwayatPembayaranAktivitasDokumenData.nomor_kwitansi_tanda_terima,
        enabled: riwayatPembayaranAktivitasDokumenData.enabled,
    }, {
        where: {
            uuid
        }
    })
    return riwayatPembayaranAktivitasDokumen
}