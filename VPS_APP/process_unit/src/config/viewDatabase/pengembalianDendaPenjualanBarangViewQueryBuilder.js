import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pengembalianDendaPenjualanBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_view AS
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
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name
            ) AS detail_data,
            "PENGEMBALIAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid= rpdpbt.pengembalian_denda_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
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
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name
            ) AS detail_data,
            "PENGEMBALIAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pengembalian_denda_penjualan_barang_tab rpdpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rpdpbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_tab pdpbt ON pdpbt.uuid= rpdpbt.pengembalian_denda_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pdpbt.kode_akun_perkiraan
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND pdpbt.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getPengembalianDendaPenjualanBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pengembalian_denda_penjualan_barang_view';
    `
}

export const getDataFrompengembalianDendaPenjualanBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            pdpbv.* 
        FROM ${generateDatabaseName(req_id)}.pengembalian_denda_penjualan_barang_view pdpbv
        ${kode_akun_perkiraan ? `WHERE pdpbv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND pdpbv.bulan = ${bulan}
            AND pdpbv.tahun = ${tahun}
        ` : `
            WHERE pdpbv.bulan = ${bulan}
            AND pdpbv.tahun = ${tahun}
        `}
    `
}