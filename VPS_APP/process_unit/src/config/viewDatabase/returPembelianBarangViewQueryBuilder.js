import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const returPembelianBarangViewQueryBuilder = (req_id) => {
    return `
        CREATE VIEW ${generateDatabaseName(req_id)}.retur_pembelian_barang_view AS
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            rpbt.bukti_transaksi AS bukti_transaksi,
            rpbt.tanggal AS tanggal,
            LPAD(MONTH(rpbt.tanggal), 2, '0') AS bulan,
            YEAR(rpbt.tanggal) AS tahun,
            0 AS transaksi,
            rrpbt.nilai_retur AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_pembelian_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_pembelian_barang', ppbt2.nomor_pesanan_pembelian_barang,
                'supplier_name', st.name,
                'supplier_code', st.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PEMBELIAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_pembelian_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid= rrpbt.retur_pembelian_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier 
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
            1 AS transaksi,
            0 AS debet,
            rrpbt.nilai_retur AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            rpbt.keterangan AS uraian,
            JSON_OBJECT (
                'satuan_barang_name', sbt.name,
                'faktur_pembelian_barang', fpbt.bukti_transaksi,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'pesanan_pembelian_barang', ppbt2.nomor_pesanan_pembelian_barang,
                'supplier_name', st.name,
                'supplier_code', st.code,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'jumlah', rrpbt.retur,
                'harga', rppbt2.harga,
                'ppn', rppbt2.ppn,
                'diskon_persentase', rppbt2.diskon_persentase
            ) AS detail_data,
            "RETUR PEMBELIAN BARANG" AS sumber
        FROM ${generateDatabaseName(req_id)}.rincian_retur_pembelian_barang_tab rrpbt 
        JOIN ${generateDatabaseName(req_id)}.rincian_pesanan_pembelian_barang_tab rppbt2 ON rppbt2.uuid = rrpbt.rincian_pesanan_pembelian_barang 
        JOIN ${generateDatabaseName(req_id)}.pesanan_pembelian_barang_tab ppbt2 ON ppbt2.uuid = rppbt2.pesanan_pembelian_barang 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = rppbt2.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang 
        JOIN ${generateDatabaseName(req_id)}.retur_pembelian_barang_tab rpbt ON rpbt.uuid= rrpbt.retur_pembelian_barang
        JOIN ${generateDatabaseName(req_id)}.faktur_pembelian_barang_tab fpbt ON fpbt.pesanan_pembelian_barang = ppbt2.uuid 
        JOIN ${generateDatabaseName(req_id)}.supplier_tab st ON st.uuid = ppbt2.supplier 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dea2ce84-fb39-4c6d-bac2-99e37b4fd492"	
        WHERE rrpbt.enabled = 1
        AND rpbt.enabled = 1
        AND rppbt2.enabled = 1
        AND ppbt2.enabled = 1
        AND fpbt.enabled = 1
    `
}

export const getReturPembelianBarangViewQuery = (req_id) => {
    return `
        SELECT 
            COUNT(0) AS count
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '${generateDatabaseName(req_id)}' 
        AND TABLE_NAME = 'retur_pembelian_barang_view';
    `
}

export const getDataFromReturPembelianBarangViewQuery = (bulan, tahun, kode_akun_perkiraan, req_id) => {
    return `
        SELECT 
            rpblv.* 
        FROM ${generateDatabaseName(req_id)}.retur_pembelian_barang_view rpblv
        ${kode_akun_perkiraan ? `WHERE rpblv.uuid_akun = "${kode_akun_perkiraan}"` : ``}
        ${kode_akun_perkiraan ? `
            AND rpblv.bulan = ${bulan}
            AND rpblv.tahun = ${tahun}
        ` : `
            WHERE rpblv.bulan = ${bulan}
            AND rpblv.tahun = ${tahun}
        `}
    `
}