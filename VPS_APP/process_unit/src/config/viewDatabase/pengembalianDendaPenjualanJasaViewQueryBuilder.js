import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pengembalianDendaPenjualanJasaViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_view AS
        SELECT
            "NOT_AVAILABLE" AS uuid,
            pdpbt.bukti_transaksi AS bukti_transaksi,
            pdpbt.tanggal AS tanggal,
            LPAD(MONTH(pdpbt.tanggal), 2, '0') AS bulan,
            YEAR(pdpbt.tanggal) AS tahun,
            0 AS transaksi,
            rpdpbt.denda_yang_dikembalikan AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            pdpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name
            ) AS detail_data,
            "PENGEMBALIAN DENDA PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.uuid= rpdpbt.pengembalian_denda_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "7b7a9b89-a712-4085-bdac-617ce712561c"
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND pdpbt.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL
        SELECT
            "NOT_AVAILABLE" AS uuid,
            pdpbt.bukti_transaksi AS bukti_transaksi,
            pdpbt.tanggal AS tanggal,
            LPAD(MONTH(pdpbt.tanggal), 2, '0') AS bulan,
            YEAR(pdpbt.tanggal) AS tahun,
            1 AS transaksi,
            0 AS debet,
            rpdpbt.denda_yang_dikembalikan AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            pdpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name
            ) AS detail_data,
            "PENGEMBALIAN DENDA PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_jasa_tab rpdpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_tab pdpbt ON pdpbt.uuid= rpdpbt.pengembalian_denda_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pdpbt.kode_akun_perkiraan
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND pdpbt.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getPengembalianDendaPenjualanJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pengembalian_denda_penjualan_jasa_view';
    `
}

export const getDataFrompengembalianDendaPenjualanJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            pdpjv.* 
        FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_jasa_view pdpjv
        ${kode_akun_perkiraan ? `WHERE pdpjv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND pdpjv.bulan = ${bulan}
            AND pdpjv.tahun = ${tahun}
        ` : `
            WHERE pdpjv.bulan = ${bulan}
            AND pdpjv.tahun = ${tahun}
        `}
    `
}