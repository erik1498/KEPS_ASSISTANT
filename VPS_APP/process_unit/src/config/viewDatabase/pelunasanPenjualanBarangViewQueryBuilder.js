import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pelunasanPenjualanBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt.bukti_transaksi AS bukti_transaksi,
            ppbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt.tanggal)) ELSE MONTH(ppbt.tanggal) END
            ) AS bulan,
            YEAR(ppbt.tanggal) AS tahun,
            0 AS transaksi,
            rppbt.nilai_pelunasan AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            ppbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt2.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rppbt2.jumlah,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "PELUNASAN PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 ON rppbt2.uuid = rppbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid= rppbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt.kode_akun_perkiraan 
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt.bukti_transaksi AS bukti_transaksi,
            ppbt.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt.tanggal)) ELSE MONTH(ppbt.tanggal) END
            ) AS bulan,
            YEAR(ppbt.tanggal) AS tahun,
            1 AS transaksi,
            0 AS debet,
            rppbt.nilai_pelunasan AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            ppbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt2.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rppbt2.jumlah,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "PELUNASAN PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_barang_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt2 ON rppbt2.uuid = rppbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt ON ppbt.uuid= rppbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getPelunasanPenjualanBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pelunasan_penjualan_barang_view';
    `
}

export const getDataFromPelunasanPenjualanBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppbv2.* 
        FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_view ppbv2
        ${kode_akun_perkiraan ? `WHERE ppbv2.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppbv2.bulan = ${bulan}
            AND ppbv2.tahun = ${tahun}
        ` : `
            WHERE ppbv2.bulan = ${bulan}
            AND ppbv2.tahun = ${tahun}
        `}
    `
}