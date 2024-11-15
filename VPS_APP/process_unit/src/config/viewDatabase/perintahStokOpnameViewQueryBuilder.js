import { generateDatabaseName } from "../../utils/databaseUtil.js"
import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js"

export const perintahStokOpnameQueryBuilder = (bulan, tahun, req_id) => {
    return `
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            psot.nomor_surat_perintah AS bukti_transaksi,
            "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59" AS tanggal,
            LPAD(psot.bulan_transaksi, 2, '0') AS bulan,
            psot.tahun,
            sabt.id AS transaksi,
            ppt.stok_tersedia_sistem * khbt.harga_beli AS debet,
            0 AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            CONCAT("Penyesuaian Persediaan Barang Stok Sistem ", khbt.kode_barang, "  ", dgt.name) AS uraian,
            JSON_OBJECT (
                'surat_perintah', psot.nomor_surat_perintah,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'harga_beli', khbt.harga_beli,
                'stok_sistem', ppt.stok_tersedia_sistem,
                'kuantitas', ppt.kuantitas,
                'tipe_penyesuaian', ppt.tipe_penyesuaian,
                'keterangan_penyesuaian_persediaan', ppt.keterangan,
                'jumlah_penyesuaian', ppt.jumlah,
                'satuan_barang_name', sbt.name,
                'stok_awal_barang', sabt.uuid
            ) AS detail_data,
            "PERINTAH STOK OPNAME" AS sumber
        FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot ON hsot.uuid = ppt.hasil_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot ON psot.uuid = ppt.perintah_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = hsot.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang 
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "4710e8be-e0c2-4318-8b42-ea8c58aa2312"
        WHERE ppt.enabled = 1
        AND hsot.enabled = 1
        AND psot.enabled = 1
        AND psot.bulan_transaksi = ${bulan}
        AND psot.tahun = ${tahun}
        UNION ALL 	
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            psot.nomor_surat_perintah AS bukti_transaksi,
            "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59" AS tanggal,
            LPAD(psot.bulan_transaksi, 2, '0') AS bulan,
            psot.tahun,
            sabt.id AS transaksi,
            0 AS debet,
            hsot.kuantitas * khbt.harga_beli AS kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            CONCAT("Penyesuaian Persediaan Barang Kuantitas Hasil Stok Opname ", khbt.kode_barang, "  ", dgt.name) AS uraian,
            JSON_OBJECT (
                'surat_perintah', psot.nomor_surat_perintah,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'harga_beli', khbt.harga_beli,
                'stok_sistem', ppt.stok_tersedia_sistem,
                'tipe_penyesuaian', ppt.tipe_penyesuaian,
                'keterangan_penyesuaian_persediaan', ppt.keterangan,
                'jumlah_penyesuaian', ppt.jumlah,
                'satuan_barang_name', sbt.name,
                'stok_awal_barang', sabt.uuid
            ) AS detail_data,
            "PERINTAH STOK OPNAME" AS sumber
        FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot ON hsot.uuid = ppt.hasil_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot ON psot.uuid = ppt.perintah_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = hsot.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "018cdcf2-f5ce-4d1a-b320-17b89a0c5556"
        WHERE ppt.enabled = 1
        AND hsot.enabled = 1
        AND psot.enabled = 1
        AND psot.bulan_transaksi = ${bulan}
        AND psot.tahun = ${tahun}
        UNION ALL
        SELECT 
            "NOT_AVAILABLE" AS uuid,
            psot.nomor_surat_perintah AS bukti_transaksi,
            "${tahun}-${`${bulan}`.padStart(2, '0')}-${getTanggalTerakhirPadaBulan(tahun, bulan)}T23:59:59" AS tanggal,
            LPAD(psot.bulan_transaksi, 2, '0') AS bulan,
            psot.tahun,
            sabt.id AS transaksi,
            CASE 
                WHEN ppt.tipe_penyesuaian = "PENAMBAHAN"
                THEN ppt.jumlah * khbt.harga_beli
                ELSE 0
            END debet,
            CASE 
                WHEN ppt.tipe_penyesuaian = "PENGURANGAN"
                THEN ppt.jumlah * khbt.harga_beli
                ELSE 0
            END kredit,
            kapt.name AS nama_akun,
            kapt.code AS kode_akun,
            kapt.type AS type_akun,
            kapt.uuid AS uuid_akun,
            CONCAT("Penyesuaian Persediaan Barang Kuantitas Hasil Stok Opname ", khbt.kode_barang, "  ", dgt.name) AS uraian,
            JSON_OBJECT (
                'surat_perintah', psot.nomor_surat_perintah,
                'kategori_harga_barang_kode_barang', khbt.kode_barang,
                'daftar_gudang_name', dgt.name,
                'daftar_barang_name', dbt.name,
                'harga_beli', khbt.harga_beli,
                'stok_sistem', ppt.stok_tersedia_sistem,
                'tipe_penyesuaian', ppt.tipe_penyesuaian,
                'keterangan_penyesuaian_persediaan', ppt.keterangan,
                'jumlah_penyesuaian', ppt.jumlah,
                'satuan_barang_name', sbt.name,
                'stok_awal_barang', sabt.uuid
            ) AS detail_data,
            "PERINTAH STOK OPNAME" AS sumber
        FROM ${generateDatabaseName(req_id)}.penyesuaian_persediaan_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.hasil_stok_opname_tab hsot ON hsot.uuid = ppt.hasil_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.perintah_stok_opname_tab psot ON psot.uuid = ppt.perintah_stok_opname 
        JOIN ${generateDatabaseName(req_id)}.stok_awal_barang_tab sabt ON sabt.uuid = hsot.stok_awal_barang 
        JOIN ${generateDatabaseName(req_id)}.daftar_gudang_tab dgt ON dgt.uuid = sabt.daftar_gudang 
        JOIN ${generateDatabaseName(req_id)}.daftar_barang_tab dbt ON dbt.uuid = sabt.daftar_barang
        JOIN ${generateDatabaseName(req_id)}.kategori_harga_barang_tab khbt ON khbt.uuid = sabt.kategori_harga_barang 
        JOIN ${generateDatabaseName(req_id)}.satuan_barang_tab sbt ON sbt.uuid = khbt.satuan_barang
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = (
            CASE 
                WHEN ppt.tipe_penyesuaian = "PENGURANGAN"
                THEN "06bb2055-466d-4c4b-a0f8-7805648ffd01"
                ELSE CASE 
                    WHEN ppt.tipe_penyesuaian = "PENAMBAHAN"
                    THEN "675780c8-8ab4-401e-afe1-efc5684bb5f3"
                    ELSE NULL
                END
            END
        )
        WHERE ppt.enabled = 1
        AND hsot.enabled = 1
        AND psot.enabled = 1
        AND psot.bulan_transaksi = ${bulan}
        AND psot.tahun = ${tahun}
    `
}