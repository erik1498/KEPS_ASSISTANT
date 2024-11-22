import { generateDatabaseName } from "../../utils/databaseUtil.js"
import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js"

export const fakturPenjualanJasaQueryBuilder = (bulan, tahun, req_id) => {
    return `
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            res.bukti_transaksi,
            "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59" AS tanggal,
            ${`${bulan}`.padStart(2, '0')} AS bulan,
            YEAR("${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59") AS tahun,
            0 AS transaksi,
            (
                SELECT
                    CASE
                        WHEN res.piutang_denda > 0
                        THEN res.piutang_denda
                        ELSE 0
                    END
            ) AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            "DENDA PENJUALAN JASA" AS uraian,
            res.detail_data_2 AS detail_data,
            "DENDA PENJUALAN JASA" AS sumber
        FROM (
            SELECT 
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) AS total_denda,
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) - res.denda_sudah_dibayar AS piutang_denda,
                res.*
            FROM (
                SELECT 
                    (res.sudah_dibayar - res.nilai_retur) AS sudah_dibayar_fix,
                    CASE
                        WHEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur) > 0
                        THEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur)
                        ELSE 0
                    END AS piutang,
                    JSON_MERGE_PRESERVE (
                        res.detail_data_1,
                        JSON_OBJECT(
                            'denda_sudah_dibayar', res.denda_sudah_dibayar,
                            'hari_terlewat', res.hari_terlewat,
                            'sudah_dibayar', res.sudah_dibayar,
                            'retur', res.nilai_retur
                        )
                    ) AS detail_data_2,
                    res.*
                FROM (
                    SELECT 
                        IFNULL((
                            SELECT 
                                SUM(rrpjt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpjt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpjt ON rpjt.uuid = rrpjt.retur_penjualan_jasa 
                            WHERE rrpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND rrpjt.enabled = 1
                            AND rpjt.enabled = 1
                            AND rpjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpjt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpjt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpjt ON rpjt.uuid = rrpjt.retur_penjualan_jasa 
                            WHERE rrpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND rrpjt.enabled = 1
                            AND rpjt.enabled = 1
                            AND rpjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS nilai_retur,
                        IFNULL((
                            SELECT 
                                SUM(rppjt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppjt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt2 ON ppjt2.uuid = rppjt2.pelunasan_penjualan_jasa
                            WHERE rppjt2.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND ppjt2.enabled = 1
                            AND ppjt2.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdjt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpjt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpjt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpjt ON pdpjt.uuid = rpdpjt.pengembalian_denda_penjualan_jasa
                                    WHERE rpdpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                                    AND pdpjt.enabled = 1
                                    AND rpdpjt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdjt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt ON ppjt.uuid = rppdjt.pelunasan_penjualan_jasa
                            WHERE rppdjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND ppjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                            AND rppdjt.enabled = 1
                            AND ppjt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                                ,
                                (
                                    ADDDATE( fpjt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppjt.harga_setelah_diskon,
                        rppjt.ppn_setelah_diskon,
                        rppjt.jumlah,
                        rppjt.diskon_angka,
                        rppjt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        fpjt.bukti_transaksi,
                        rppjt.id,
                        JSON_OBJECT (
                            'satuan_jasa_name', sjt.name,
                            'faktur_penjualan_jasa', fpjt.nomor_faktur_penjualan_jasa,
                            'kategori_harga_jasa_kode_jasa', khjt.kode_jasa,
                            'pesanan_penjualan_jasa', ppjt.nomor_pesanan_penjualan_jasa,
                            'customer_name', ct.name,
                            'customer_code', ct.code,
                            'cabang_name', ct2.name,
                            'daftar_jasa_name', djt.name,
                            'jatuh_tempo', ADDDATE( fpjt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                            'tanggal_faktur', fpjt.tanggal
                        ) AS detail_data_1
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppjt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppjt ON ppjt.uuid = rppjt.pesanan_penjualan_jasa
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khjt ON khjt.uuid = rppjt.kategori_harga_jasa 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt ON sajt.uuid = rppjt.stok_awal_jasa 
                    JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sajt.cabang
                    JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab djt ON djt.uuid = khjt.daftar_jasa
                    JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sjt ON sjt.uuid = khjt.satuan_jasa
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt ON fpjt.pesanan_penjualan_jasa = ppjt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpjt.syarat_pembayaran
                    JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppjt.customer
                    WHERE rppjt.enabled = 1
                    AND ppjt.enabled = 1
                    AND fpjt.enabled = 1
                ) AS res
            ) AS res
        ) AS res
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "eb5b6dcd-1146-4550-a9f0-1fe8439b085f"
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            res.bukti_transaksi,
            "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59" AS tanggal,
            ${`${bulan}`.padStart(2, '0')} AS bulan,
            YEAR("${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59") AS tahun,
            1 AS transaksi,
            0 AS debet,
            (
                SELECT
                    CASE
                        WHEN res.piutang_denda > 0
                        THEN res.piutang_denda
                        ELSE 0
                    END
            ) AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            "DENDA PENJUALAN JASA" AS uraian,
            res.detail_data_2 AS detail_data,
            "DENDA PENJUALAN JASA" AS sumber
        FROM (
            SELECT 
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) AS total_denda,
                (res.piutang * (res.syarat_pembayaran_denda / 100) * res.hari_terlewat) - res.denda_sudah_dibayar AS piutang_denda,
                res.*
            FROM (
                SELECT 
                    (res.sudah_dibayar - res.nilai_retur) AS sudah_dibayar_fix,
                    CASE
                        WHEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur) > 0
                        THEN ((res.harga_setelah_diskon + res.ppn_setelah_diskon) * (res.jumlah - res.retur)) - (res.sudah_dibayar - res.nilai_retur)
                        ELSE 0
                    END AS piutang,
                    JSON_MERGE_PRESERVE (
                        res.detail_data_1,
                        JSON_OBJECT(
                            'denda_sudah_dibayar', res.denda_sudah_dibayar,
                            'hari_terlewat', res.hari_terlewat,
                            'sudah_dibayar', res.sudah_dibayar,
                            'retur', res.nilai_retur
                        )
                    ) AS detail_data_2,
                    res.*
                FROM (
                    SELECT 
                        IFNULL((
                            SELECT 
                                SUM(rrpjt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpjt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpjt ON rpjt.uuid = rrpjt.retur_penjualan_jasa 
                            WHERE rrpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND rrpjt.enabled = 1
                            AND rpjt.enabled = 1
                            AND rpjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpjt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpjt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpjt ON rpjt.uuid = rrpjt.retur_penjualan_jasa 
                            WHERE rrpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND rrpjt.enabled = 1
                            AND rpjt.enabled = 1
                            AND rpjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS nilai_retur,
                        IFNULL((
                            SELECT 
                                SUM(rppjt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppjt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt2 ON ppjt2.uuid = rppjt2.pelunasan_penjualan_jasa
                            WHERE rppjt2.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND ppjt2.enabled = 1
                            AND ppjt2.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdjt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpjt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpjt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpjt ON pdpjt.uuid = rpdpjt.pengembalian_denda_penjualan_jasa
                                    WHERE rpdpjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                                    AND pdpjt.enabled = 1
                                    AND rpdpjt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdjt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppjt ON ppjt.uuid = rppdjt.pelunasan_penjualan_jasa
                            WHERE rppdjt.rincian_pesanan_penjualan_jasa = rppjt.uuid
                            AND ppjt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                            AND rppdjt.enabled = 1
                            AND ppjt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                                ,
                                (
                                    ADDDATE( fpjt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppjt.harga_setelah_diskon,
                        rppjt.ppn_setelah_diskon,
                        rppjt.jumlah,
                        rppjt.diskon_angka,
                        rppjt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        fpjt.bukti_transaksi,
                        rppjt.id,
                        JSON_OBJECT (
                            'satuan_jasa_name', sjt.name,
                            'faktur_penjualan_jasa', fpjt.nomor_faktur_penjualan_jasa,
                            'kategori_harga_jasa_kode_jasa', khjt.kode_jasa,
                            'pesanan_penjualan_jasa', ppjt.nomor_pesanan_penjualan_jasa,
                            'customer_name', ct.name,
                            'customer_code', ct.code,
                            'cabang_name', ct2.name,
                            'daftar_jasa_name', djt.name,
                            'jatuh_tempo', ADDDATE( fpjt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                            'tanggal_faktur', fpjt.tanggal
                        ) AS detail_data_1
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppjt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppjt ON ppjt.uuid = rppjt.pesanan_penjualan_jasa
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khjt ON khjt.uuid = rppjt.kategori_harga_jasa 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sajt ON sajt.uuid = rppjt.stok_awal_jasa 
                    JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sajt.cabang
                    JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab djt ON djt.uuid = khjt.daftar_jasa
                    JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sjt ON sjt.uuid = khjt.satuan_jasa
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpjt ON fpjt.pesanan_penjualan_jasa = ppjt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpjt.syarat_pembayaran
                    JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppjt.customer
                    WHERE rppjt.enabled = 1
                    AND ppjt.enabled = 1
                    AND fpjt.enabled = 1
                ) AS res
            ) AS res
        ) AS res
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"
    `
}

export const getFakturPenjualanJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'faktur_penjualan_jasa_view';
    `
}

export const getDataFromFakturPenjualanJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            fpjv.* 
        FROM ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_view fpjv
        ${kode_akun_perkiraan ? `WHERE fpjv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND fpjv.bulan = ${bulan}
            AND fpjv.tahun = ${tahun}
        ` : `
            WHERE fpjv.bulan = ${bulan}
            AND fpjv.tahun = ${tahun}
        `}
    `
}