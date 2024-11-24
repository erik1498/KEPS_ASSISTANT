import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const pesananPembelianBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_view AS
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "e86d5fd7-958c-4cb3-839d-ca70f6abe123"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "6453a29e-d506-46e5-8f05-1ff8817b8813"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "93919470-8a98-4f67-a373-fe6726b7aae2"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "6453a29e-d506-46e5-8f05-1ff8817b8813"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "6453a29e-d506-46e5-8f05-1ff8817b8813"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "71786d7c-f0e3-4e4e-b8da-ebd79cac3c02"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "93919470-8a98-4f67-a373-fe6726b7aae2"
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
                    'satuan_barang_name', sbt.name,
                    'faktur_pembelian_barang', fpbt.bukti_transaksi,
                    'kategori_harga_barang_kode_barang', khbt.kode_barang,
                    'pesanan_pembelian_barang', ppbt.nomor_pesanan_pembelian_barang,
                    'supplier_name', st.name,
                    'supplier_code', st.code,
                    'daftar_gudang_name', dgt.name,
                    'daftar_barang_name', dbt.name,
                    'jumlah', rppbt.jumlah,
                    'harga', rppbt.harga,
                    'ppn', rppbt.ppn,
                    'diskon_persentase', rppbt.diskon_persentase
                ) AS detail_data,
                "FAKTUR PEMBELIAN BARANG" AS sumber
            FROM ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt 
            JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt.stok_awal_barang 
            JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
            JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
            JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
            JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
            JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt ON ppbt.uuid = rppbt.pesanan_pembelian_barang 
            JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt.uuid 
            JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt.supplier 
            JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "71786d7c-f0e3-4e4e-b8da-ebd79cac3c02"
            WHERE ppbt.enabled = 1 
            AND rppbt.enabled = 1
            AND fpbt.enabled = 1
        `
}

export const getPesananPembelianBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'pesanan_pembelian_barang_view';
    `
}

export const getDataFromPesananPembelianBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            ppblv.* 
        FROM ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_view ppblv
        ${kode_akun_perkiraan ? `WHERE ppblv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND ppblv.bulan = ${bulan}
            AND ppblv.tahun = ${tahun}
        ` : `
            WHERE ppblv.bulan = ${bulan}
            AND ppblv.tahun = ${tahun}
        `}
    `
}