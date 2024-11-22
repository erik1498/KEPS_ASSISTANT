import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pelunasanPenjualanDendaJasaViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pelunasan_penjualan_denda_jasa_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt2.bukti_transaksi AS bukti_transaksi,
            ppbt2.tanggal AS tanggal,
            LPAD(MONTH(ppbt2.tanggal), 2, '0') AS bulan,
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
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'hari_terlewat', rppdbt.hari_terlewat,
                'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                'tanggal_faktur', fpbt.tanggal
            ) AS detail_data,
            "PELUNASAN DENDA PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rppdbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid= rppdbt.pelunasan_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppbt2.kode_akun_perkiraan
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
            LPAD(MONTH(ppbt2.tanggal), 2, '0') AS bulan,
            YEAR(ppbt2.tanggal) AS tahun,
            1 AS transaksi,
            0 AS debet,
            rppdbt.nilai_pelunasan AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            ppbt2.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'hari_terlewat', rppdbt.hari_terlewat,
                'jatuh_tempo', ADDDATE( fpbt.tanggal, INTERVAL spt.hari_kadaluarsa DAY ),
                'tanggal_faktur', fpbt.tanggal
            ) AS detail_data,
            "PELUNASAN DENDA PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_denda_jasa_tab rppdbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt ON rppbt.uuid = rppdbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid= rppdbt.pelunasan_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt.uuid 
        JOIN ${generateDatabaseName(req_id)}.syarat_pembayaran_tab spt ON spt.uuid = fpbt.syarat_pembayaran
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "ddb0e69f-9704-4555-b427-5748365034f7"
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getPelunasanPenjualanDendaJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pelunasan_penjualan_denda_jasa_view';
    `
}

export const getDataFromPelunasanPenjualanDendaJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppdjv.* 
        FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_denda_jasa_view ppdjv
        ${kode_akun_perkiraan ? `WHERE ppdjv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppdjv.bulan = ${bulan}
            AND ppdjv.tahun = ${tahun}
        ` : `
            WHERE ppdjv.bulan = ${bulan}
            AND ppdjv.tahun = ${tahun}
        `}
    `
}