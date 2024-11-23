import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const returPenjualanJasaViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.retur_penjualan_jasa_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            LPAD(MONTH(rpbt.tanggal), 2, '0') AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            0 AS transaksi,
            (
                SELECT 
                    CASE 
                        WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                        THEN ((100 - rppbt2.diskon_persentase) * rrpbt.nilai_retur) / 100
                        ELSE rppbt2.harga_setelah_diskon  * rrpbt.retur
                    END
            ) AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid= rrpbt.retur_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "ad6d4852-27dd-4b6e-8d26-eb812084d248"	
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            LPAD(MONTH(rpbt.tanggal), 2, '0') AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            1 AS transaksi,
            0 AS debet,
            (
                SELECT 
                    CASE 
                        WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                        THEN ((100 - rppbt2.diskon_persentase) * rrpbt.nilai_retur) / 100
                        ELSE rppbt2.harga_setelah_diskon  * rrpbt.retur
                    END
            ) AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid= rrpbt.retur_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            LPAD(MONTH(rpbt.tanggal), 2, '0') AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            2 AS transaksi,
            (
                SELECT 
                    CASE 
                        WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                        THEN (rppbt2.diskon_persentase * rrpbt.nilai_retur) / 100
                        ELSE rppbt2.ppn_setelah_diskon  * rrpbt.retur
                    END
            ) AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid= rrpbt.retur_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"		
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            LPAD(MONTH(rpbt.tanggal), 2, '0') AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            3 AS transaksi,
            0 AS debet,
            (
                SELECT 
                    CASE 
                        WHEN (rppbt2.harga_setelah_diskon + rppbt2.ppn_setelah_diskon) * rrpbt.retur > rrpbt.nilai_retur 
                        THEN (rppbt2.diskon_persentase * rrpbt.nilai_retur) / 100
                        ELSE rppbt2.ppn_setelah_diskon  * rrpbt.retur
                    END
            ) AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_penjualan_jasa_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.retur_penjualan_jasa_tab rpbt ON rpbt.uuid= rrpbt.retur_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = rpbt.kode_akun_perkiraan		
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getReturPenjualanJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'retur_penjualan_jasa_view';
    `
}

export const getDataFromReturPenjualanJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            rpjv.* 
        FROM ${generateDatabaseName(req_id)}.retur_penjualan_jasa_view rpjv
        ${kode_akun_perkiraan ? `WHERE rpjv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND rpjv.bulan = ${bulan}
            AND rpjv.tahun = ${tahun}
        ` : `
            WHERE rpjv.bulan = ${bulan}
            AND rpjv.tahun = ${tahun}
        `}
    `
}