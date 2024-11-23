import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pesananPenjualanJasaViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_view AS
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                0 AS transaksi,
                rppbt.harga * rppbt.jumlah AS debet,
                0 AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "826a9418-4b0e-4ca4-8a83-6c392e7a4cf1"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                1 AS transaksi,
                0 AS debet,
                rppbt.harga * rppbt.jumlah AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "453764da-957f-4099-a03d-268367987dc2"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                2 AS transaksi,
                rppbt.ppn * rppbt.jumlah AS debet,
                0 AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "826a9418-4b0e-4ca4-8a83-6c392e7a4cf1"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                3 AS transaksi,
                0 AS kredit,
                rppbt.ppn * rppbt.jumlah AS debet,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                4 AS transaksi,
                rppbt.diskon_angka * rppbt.jumlah AS debet,
                0 AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "7eee8bbd-b5c3-4351-9ff8-cdbe814806b9"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                5 AS transaksi,
                0 AS debet,
                rppbt.diskon_angka * rppbt.jumlah AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "826a9418-4b0e-4ca4-8a83-6c392e7a4cf1"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                6 AS transaksi,
                (rppbt.ppn - rppbt.ppn_setelah_diskon) * rppbt.jumlah AS debet,
                0 AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "7eee8bbd-b5c3-4351-9ff8-cdbe814806b9"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                LPAD(MONTH(fpbt.tanggal), 2, '0') AS bulan,
                YEAR(fpbt.tanggal) AS tahun,
                7 AS transaksi,
                0 AS debet,
                (rppbt.ppn - rppbt.ppn_setelah_diskon) * rppbt.jumlah AS kredit,
                kapt.name AS nama_akun,
                kapt.code AS kode_akun,
                kapt.type AS type_akun,
                kapt.uuid AS uuid_akun,
                fpbt.keterangan AS uraian,
                JSON_OBJECT (
                    'satuan_jasa_name', sbt.name,
                    'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                    'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                    'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'cabang_name', ct2.name,
                    'daftar_jasa_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN JASA" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
            JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
            JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
            JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
        `
}

export const getPesananPenjualanJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pesanan_penjualan_jasa_view';
    `
}

export const getDataFromPesananPenjualanJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppjv.* 
        FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_view ppjv
        ${kode_akun_perkiraan ? `WHERE ppjv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppjv.bulan = ${bulan}
            AND ppjv.tahun = ${tahun}
        ` : `
            WHERE ppjv.bulan = ${bulan}
            AND ppjv.tahun = ${tahun}
        `}
    `
}