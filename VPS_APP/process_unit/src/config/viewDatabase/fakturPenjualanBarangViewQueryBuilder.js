import { generateDatabaseName } from "../../utils/databaseUtil.js"
import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js"

export const fakturPenjualanBarangQueryBuilder = (bulan, tahun, req_id) => {
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
            "DENDA PENJUALAN BARANG" AS uraian,
            res.detail_data_2 AS detail_data,
            "DENDA PENJUALAN BARANG" AS sumber
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
                                SUM(rrpbt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS nilai_retur,
                        IFNULL((
                            SELECT 
                                SUM(rppbt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                            WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt2.enabled = 1
                            AND ppbt2.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdbt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpbt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                                    WHERE rpdpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                                    AND pdpbt.enabled = 1
                                    AND rpdpbt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_barang
                            WHERE rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                            AND rppdbt.enabled = 1
                            AND ppbt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                                ,
                                (
                                    ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppbt.harga_setelah_diskon,
                        rppbt.ppn_setelah_diskon,
                        rppbt.jumlah,
                        rppbt.diskon_angka,
                        rppbt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        fpbt.bukti_transaksi,
                        rppbt.id,
                        JSON_OBJECT (
                            'satuan_barang_name', sbt.name,
                            'faktur_penjualan_barang', fpbt.nomor_faktur_penjualan_barang,
                            'kategori_harga_barang_kode_barang', khbt.kode_barang,
                            'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                            'customer_name', ct.name,
                            'customer_code', ct.code,
                            'daftar_gudang_name', dgt.name,
                            'daftar_barang_name', dbt.name,
                            'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                            'tanggal_faktur', fpbt.tanggal
                        ) AS detail_data_1
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                    JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                    JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
                    JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                    WHERE rppbt.enabled = 1
                    AND ppbt.enabled = 1
                    AND fpbt.enabled = 1
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
            "DENDA PENJUALAN BARANG" AS uraian,
            res.detail_data_2 AS detail_data,
            "DENDA PENJUALAN BARANG" AS sumber
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
                                SUM(rrpbt.retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS retur,
                        IFNULL((
                            SELECT 
                                SUM(rrpbt.nilai_retur) 
                            FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_barang_tab rrpbt 
                            JOIN ${generateDatabaseName(req_id)}.retur_penjualan_barang_tab rpbt ON rpbt.uuid = rrpbt.retur_penjualan_barang 
                            WHERE rrpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND rrpbt.enabled = 1
                            AND rpbt.enabled = 1
                            AND rpbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS nilai_retur,
                        IFNULL((
                            SELECT 
                                SUM(rppbt2.nilai_pelunasan) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt2
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pelunasan_penjualan_barang
                            WHERE rppbt2.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt2.enabled = 1
                            AND ppbt2.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                        ), 0) AS sudah_dibayar,
                        IFNULL((
                            SELECT 
                                SUM(rppdbt.nilai_pelunasan)
                                - IFNULL((
                                    SELECT 
                                        SUM(rpdpbt.denda_yang_dikembalikan) 
                                    FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
                                    JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid = rpdpbt.pengembalian_denda_penjualan_barang
                                    WHERE rpdpbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                                    AND pdpbt.enabled = 1
                                    AND rpdpbt.enabled = 1
                                ), 0) 
                            FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt
                            JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid = rppdbt.pelunasan_penjualan_barang
                            WHERE rppdbt.rincian_pesanan_penjualan_barang = rppbt.uuid
                            AND ppbt.tanggal < "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                            AND rppdbt.enabled = 1
                            AND ppbt.enabled = 1
                        ), 0) AS denda_sudah_dibayar, 
                        (
                            DATEDIFF(
                                "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59"
                                ,
                                (
                                    ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY )
                                )
                            )
                        ) AS hari_terlewat,
                        rppbt.harga_setelah_diskon,
                        rppbt.ppn_setelah_diskon,
                        rppbt.jumlah,
                        rppbt.diskon_angka,
                        rppbt.diskon_persentase,
                        spt.denda AS syarat_pembayaran_denda,
                        fpbt.bukti_transaksi,
                        rppbt.id,
                        JSON_OBJECT (
                            'satuan_barang_name', sbt.name,
                            'faktur_penjualan_barang', fpbt.nomor_faktur_penjualan_barang,
                            'kategori_harga_barang_kode_barang', khbt.kode_barang,
                            'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                            'customer_name', ct.name,
                            'customer_code', ct.code,
                            'daftar_gudang_name', dgt.name,
                            'daftar_barang_name', dbt.name,
                            'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                            'tanggal_faktur', fpbt.tanggal
                        ) AS detail_data_1
                    FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
                    JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang
                    JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = rppbt.kategori_harga_barang 
                    JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
                    JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
                    JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = khbt.daftar_barang
                    JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
                    JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
                    JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
                    JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer
                    WHERE rppbt.enabled = 1
                    AND ppbt.enabled = 1
                    AND fpbt.enabled = 1
                ) AS res
            ) AS res
        ) AS res
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"
    `
}

export const getFakturPenjualanBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'faktur_penjualan_barang_view';
    `
}

export const getDataFromFakturPenjualanBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            fpbv.* 
        FROM ${generateDatabaseName(req_id)}.faktur_penjualan_barang_view fpbv
        ${kode_akun_perkiraan ? `WHERE fpbv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND fpbv.bulan = ${bulan}
            AND fpbv.tahun = ${tahun}
        ` : `
            WHERE fpbv.bulan = ${bulan}
            AND fpbv.tahun = ${tahun}
        `}
    `
}