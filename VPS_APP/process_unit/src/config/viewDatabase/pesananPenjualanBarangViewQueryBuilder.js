import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pesananPenjualanBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_view AS
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
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
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
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
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5b04e881-b908-4400-a7f4-b78c34cc7a8c"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "33105460-6ac0-4744-a56c-6822bb4d4ba3"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5b04e881-b908-4400-a7f4-b78c34cc7a8c"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
            UNION ALL
            SELECT 
                "NOT_AVAILABLE" AS uuid,
                fpbt.bukti_transaksi AS bukti_transaksi,
                fpbt.tanggal AS tanggal,
                (
                    CASE WHEN MONTH(fpbt.tanggal) < 10 THEN CONCAT("0", MONTH(fpbt.tanggal)) ELSE MONTH(fpbt.tanggal) END
                ) AS bulan,
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
                    'satuan_barang_name', sbt.name,
                    'faktur_penjualan_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_penjualan_barang', ppbt.nomor_pesanan_penjualan_barang,
                    'customer_name', ct.name,
                    'customer_code', ct.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PENJUALAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_penjualan_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_penjualan_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_penjualan_barang_tab fpbt ON fpbt.pesanan_penjualan_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.customer_tab ct ON ct.uuid = ppbt.customer 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "c457def6-7f3c-478d-9190-15ab0b70e630"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
        `
}

export const getPesananPenjualanBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pesanan_penjualan_barang_view';
    `
}

export const getDataFromPesananPenjualanBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppbv.* 
        FROM ${generateDatabaseName(req_id)}.pesanan_penjualan_barang_view ppbv
        ${kode_akun_perkiraan ? `WHERE ppbv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppbv.bulan = ${bulan}
            AND ppbv.tahun = ${tahun}
        ` : `
            WHERE ppbv.bulan = ${bulan}
            AND ppbv.tahun = ${tahun}
        `}
    `
}