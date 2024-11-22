import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pelunasanPenjualanJasaViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            ppbt.bukti_transaksi AS bukti_transaksi,
            ppbt.tanggal AS tanggal,
            LPAD(MONTH(ppbt.tanggal), 2, '0') AS bulan,
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
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rppbt2.jumlah,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "PELUNASAN PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rppbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt ON ppbt.uuid= rppbt.pelunasan_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
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
            LPAD(MONTH(ppbt.tanggal), 2, '0') AS bulan,
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
                'satuan_jasa_name', sbt.name,
                'faktur_penjualan_jasa', fpbt.bukti_transaksi,
                'kategori_harga_jasa_kode_jasa', khbt.kode_jasa,
                'pesanan_penjualan_jasa', ppbt2.nomor_pesanan_penjualan_jasa,
                'customer_name', ct.name,
                'customer_code', ct.code,
                'cabang_name', ct2.name,
                'daftar_jasa_name', dbt.name,
                'jumlah', rppbt2.jumlah,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "PELUNASAN PENJUALAN JASA" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_pelunasan_penjualan_jasa_tab rppbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_jasa_tab rppbt2 ON rppbt2.uuid = rppbt.rincian_pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_jasa_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_penjualan_jasa 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_jasa_tab sabt ON sabt.uuid = rppbt2.stok_awal_jasa 
        JOIN ${generateDatabaseName(req_id)}.cabang_tab ct2 ON ct2.uuid = sabt.cabang
        JOIN ${generateDatabaseName(req_id)}.daftar_jasa_tab dbt ON dbt.uuid = sabt.daftar_jasa 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_jasa_tab khbt ON khbt.uuid = sabt.kategori_harga_jasa 
        JOIN ${generateDatabaseName(req_id)}.satuan_jasa_tab sbt ON sbt.uuid = khbt.satuan_jasa 
        JOIN ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_tab ppbt ON ppbt.uuid= rppbt.pelunasan_penjualan_jasa
        JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_jasa_tab fpbt ON fpbt.pesanan_penjualan_jasa = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt2.customer 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
        WHERE rppbt.enabled = 1
        AND ppbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getPelunasanPenjualanJasaViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pelunasan_penjualan_jasa_view';
    `
}

export const getDataFromPelunasanPenjualanJasaViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppjv2.* 
        FROM ${generateDatabaseName(req_id)}.pelunasan_penjualan_jasa_view ppjv2
        ${kode_akun_perkiraan ? `WHERE ppjv2.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppjv2.bulan = ${bulan}
            AND ppjv2.tahun = ${tahun}
        ` : `
            WHERE ppjv2.bulan = ${bulan}
            AND ppjv2.tahun = ${tahun}
        `}
    `
}