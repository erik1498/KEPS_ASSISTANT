import { generateDatabaseName } from "../../utils/databaseUtil"

export const pelunasanPenjualanDendaBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW pelunasan_penjualan_denda_barang_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt2.bukti_transaksi AS bukti_transaksi,
            ppbt2.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt2.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt2.tanggal)) ELSE MONTH(ppbt2.tanggal) END
            ) AS bulan,
            YEAR(ppbt2.tanggal) AS tahun,
            0 AS transaksi,
            rppdbt.nilai_pelunasan AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            ppbt2.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'hari_terlewat', rppdbt.hari_terlewat,
                'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                'tanggal_faktur', fpbt.tanggal
            ) AS detail_data,
            "PELUNASAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rppdbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid= rppdbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
        UNION ALL 
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt2.bukti_transaksi AS bukti_transaksi,
            ppbt2.tanggal AS tanggal,
            (
                CASE WHEN MONTH(ppbt2.tanggal) < 10 THEN CONCAT("0", MONTH(ppbt2.tanggal)) ELSE MONTH(ppbt2.tanggal) END
            ) AS bulan,
            YEAR(ppbt2.tanggal) AS tahun,
            0 AS transaksi,
            0 AS debet,
            rppdbt.nilai_pelunasan AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            ppbt2.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_penjualan_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'hari_terlewat', rppdbt.hari_terlewat,
                'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                'tanggal_faktur', fpbt.tanggal
            ) AS detail_data,
            "PELUNASAN DENDA PENJUALAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_barang_tab rppdbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt ON rppbt.uuid = rppdbt.rincian_pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_barang_tab ppbt2 ON ppbt2.uuid= rppdbt.pelunasan_penjualan_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt2.kode_akun_perkiraan
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getDataFromPelunasanPenjualanDendaBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppdbv.* 
        FROM ${generateDatabaseName(req_id)}.${generateDatabaseName(req_id)}.pelunasan_penjualan_denda_barang_view ppdbv
        ${kode_akun_perkiraan ? `WHERE ppdbv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppdbv.bulan = "${bulan}"
            AND ppdbv.tahun = "${tahun}
        ` : `
            WHERE ppdbv.bulan = "${bulan}"
            AND ppdbv.tahun = "${tahun}
        `}
        ORDER BY ppdbv.tanggal ASC, ppdbv.transaksi ASC
    `
}