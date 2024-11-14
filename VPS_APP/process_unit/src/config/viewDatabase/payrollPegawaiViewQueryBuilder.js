import { generateDatabaseName } from "../../utils/databaseUtil.js"

export const payrollPegawaiViewQueryBuilder = (req_id) => {
    return `
        SELECT 
            gt.uuid,
            gt.bukti_transaksi,
            LPAD(DAY(gt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
            YEAR(gt.tanggal) AS tahun,
            TIME(gt.tanggal) AS waktu,
            0 AS transaksi,
            gt.nilai AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', gt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Gaji Pegawai'
            ) AS uraian,
            "GAJI PEGAWAI" AS sumber,
            gt.enabled 
        FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "0c0a1c04-ad98-4818-9a63-9be554b2ae55" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
        WHERE gt.enabled = 1
        AND kapt.enabled = 1
        AND pt.enabled = 1
        UNION ALL 
        SELECT 
            gt.uuid,
            gt.bukti_transaksi,
            LPAD(DAY(gt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
            YEAR(gt.tanggal) AS tahun,
            TIME(gt.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            gt.nilai AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', gt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Gaji Pegawai'
            ) AS uraian,
            "GAJI PEGAWAI" AS sumber,
            gt.enabled 
        FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = gt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
        WHERE gt.enabled = 1
        AND kapt.enabled = 1
        AND pt.enabled = 1
        UNION ALL -- TUNJANGAN UANG START
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            0 AS transaksi,
            tut.bonus AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Bonus Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            tut.bonus AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Bonus Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            2 AS transaksi,
            tut.insentif AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Insentif Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            3 AS transaksi,
            0 AS debet,
            tut.insentif AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Insentif Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            4 AS transaksi,
            tut.thr AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'THR Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "dc632a24-dba2-4c65-9b42-968de322fe1c"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            5 AS transaksi,
            0 AS debet,
            tut.thr AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'THR Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            5 AS transaksi,
            tut.jp AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Pensiun Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            6 AS transaksi,
            0 AS debet,
            tut.jp AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Pensiun Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            7 AS transaksi,
            tut.jht AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Hari Tua Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            8 AS transaksi,
            0 AS debet,
            tut.jht AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Hari Tua Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            9 AS transaksi,
            tut.jkm AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Kematian Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            10 AS transaksi,
            0 AS debet,
            tut.jkm AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Kematian Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            11 AS transaksi,
            tut.jkk AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Keselamatan Kerja Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "24af525c-4519-4f26-a339-df8ef261b42d" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            12 AS transaksi,
            0 AS debet,
            tut.jkk AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Keselamatan Kerja Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = tut.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            13 AS transaksi,
            tut.bpjs_kesehatan AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'BPJS Kesehatan Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "5555ff3a-9de0-42b5-bdc8-f39c43947496" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            14 AS transaksi,
            0 AS debet,
            tut.bpjs_karyawan AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'BPJS Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            15 AS transaksi,
            0 AS debet,
            tut.jp_karyawan AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Pensiun Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            tut.uuid,
            tut.bukti_transaksi,
            LPAD(DAY(tut.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            TIME(tut.tanggal) AS waktu,
            16 AS transaksi,
            0 AS debet,
            tut.jht_karyawan AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', tut.periode,
                'pegawai_name', pt.name,
                'sumber', 'Jaminan Hari Tua Pegawai'
            ) AS uraian,
            "TUNJANGAN UANG PEGAWAI" AS sumber,
            tut.enabled 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "261984b1-4a45-4332-aaae-9687fe550262" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- LEMBUR START
        SELECT 
            lt.uuid,
            lt.bukti_transaksi,
            LPAD(DAY(lt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
            YEAR(lt.tanggal) AS tahun,
            TIME(lt.tanggal) AS waktu,
            0 AS transaksi,
            lt.total_bayaran AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'deskripsi_kerja', lt.deskripsi_kerja,
                'keterangan_kerja', lt.keterangan_kerja,
                'waktu_mulai', lt.waktu_mulai,
                'waktu_selesai', lt.waktu_selesai,
                'total_jam', lt.total_jam,
                'total_menit', lt.total_menit,
                'nilai_lembur_per_menit', lt.nilai_lembur_per_menit,
                'periode', lt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Lembur Pegawai'
            ) AS uraian,
            "LEMBUR PEGAWAI" AS sumber,
            lt.enabled 
        FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "96dc1c2e-1cd3-42b8-b580-3932ebe1e82d" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
        WHERE lt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            lt.uuid,
            lt.bukti_transaksi,
            LPAD(DAY(lt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
            YEAR(lt.tanggal) AS tahun,
            TIME(lt.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            lt.total_bayaran AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'deskripsi_kerja', lt.deskripsi_kerja,
                'keterangan_kerja', lt.keterangan_kerja,
                'waktu_mulai', lt.waktu_mulai,
                'waktu_selesai', lt.waktu_selesai,
                'total_jam', lt.total_jam,
                'total_menit', lt.total_menit,
                'nilai_lembur_per_menit', lt.nilai_lembur_per_menit,
                'periode', lt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Lembur Pegawai'
            ) AS uraian,
            "LEMBUR PEGAWAI" AS sumber,
            lt.enabled 
        FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = lt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
        WHERE lt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- HADIAH START
        SELECT 
            ht.uuid,
            ht.bukti_transaksi,
            LPAD(DAY(ht.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
            YEAR(ht.tanggal) AS tahun,
            TIME(ht.tanggal) AS waktu,
            0 AS transaksi,
            ht.nilai AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', ht.periode,
                'pegawai_name', pt.name,
                'sumber', 'Hadiah Pegawai'
            ) AS uraian,
            "HADIAH PEGAWAI" AS sumber,
            ht.enabled 
        FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "a09a5e0c-9544-4a83-b214-c47cf5c07bdd"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
        WHERE ht.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            ht.uuid,
            ht.bukti_transaksi,
            LPAD(DAY(ht.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
            YEAR(ht.tanggal) AS tahun,
            TIME(ht.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            ht.nilai AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', ht.periode,
                'pegawai_name', pt.name,
                'sumber', 'Hadiah Pegawai'
            ) AS uraian,
            "HADIAH PEGAWAI" AS sumber,
            ht.enabled 
        FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ht.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
        WHERE ht.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- PPH2126 START
        SELECT 
            ppt.uuid,
            ppt.bukti_transaksi,
            LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
            YEAR(ppt.tanggal) AS tahun,
            TIME(ppt.tanggal) AS waktu,
            0 AS transaksi,
            0 AS debet,
            ppt.nilai AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', ppt.periode,
                'pegawai_name', pt.name,
                'sumber', 'PPH 21/26 Pegawai'
            ) AS uraian,
            "PPH 21/26" AS sumber,
            ppt.enabled 
        FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = ppt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
        WHERE pt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            ppt.uuid,
            ppt.bukti_transaksi,
            LPAD(DAY(ppt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
            YEAR(ppt.tanggal) AS tahun,
            TIME(ppt.tanggal) AS waktu,
            2 AS transaksi,
            ppt.nilai AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', ppt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Lain-Lain Pegawai'
            ) AS uraian,
            "PPH 21/26" AS sumber,
            ppt.enabled 
        FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "eadfec72-7d66-4597-998d-8acf959d34b7" 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
        WHERE pt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- LAIN LAIN START
        SELECT 
            llt.uuid,
            llt.bukti_transaksi,
            LPAD(DAY(llt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
            YEAR(llt.tanggal) AS tahun,
            TIME(llt.tanggal) AS waktu,
            0 AS transaksi,
            llt.nilai AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', llt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Lain-Lain Pegawai',
                'keterangan', llt.keterangan
            ) AS uraian,
            "LAIN - LAIN" AS sumber,
            llt.enabled 
        FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "b7687ceb-6046-4062-979d-bfed5550bd87"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
        WHERE llt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            llt.uuid,
            llt.bukti_transaksi,
            LPAD(DAY(llt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
            YEAR(llt.tanggal) AS tahun,
            TIME(llt.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            llt.nilai AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', llt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Lain-Lain Pegawai',
                'keterangan', llt.keterangan
            ) AS uraian,
            "LAIN - LAIN" AS sumber,
            llt.enabled 
        FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = llt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
        WHERE llt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- KERUGIAN START
        SELECT 
            kt.uuid,
            kt.bukti_transaksi,
            LPAD(DAY(kt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
            YEAR(kt.tanggal) AS tahun,
            TIME(kt.tanggal) AS waktu,
            0 AS transaksi,
            kt.nilai AS debet,
            0 AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', kt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Kerugian Pegawai',
                'keterangan', kt.keterangan
            ) AS uraian,
            "KERUGIAN" AS sumber,
            kt.enabled 
        FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f3eafc29-6a1c-4e57-b789-532b490dac33"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
        WHERE kt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            kt.uuid,
            kt.bukti_transaksi,
            LPAD(DAY(kt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
            YEAR(kt.tanggal) AS tahun,
            TIME(kt.tanggal) AS waktu,
            1 AS transaksi,
            0 AS debet,
            kt.nilai AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', kt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Kerugian Pegawai',
                'keterangan', kt.keterangan
            ) AS uraian,
            "KERUGIAN" AS sumber,
            kt.enabled 
        FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = kt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
        WHERE kt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL -- PIUTANG PEGAWAI START
        SELECT 
            pkt.uuid,
            pkt.bukti_transaksi,
            LPAD(DAY(pkt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
            YEAR(pkt.tanggal) AS tahun,
            TIME(pkt.tanggal) AS waktu,
            0 AS transaksi,
            CASE 
                WHEN pkt.type = 0
                THEN pkt.nilai
                ELSE 0
            END AS debet,
            CASE 
                WHEN pkt.type = 1
                THEN pkt.nilai
                ELSE 0
            END AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', pkt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Piutang Pegawai',
                'keterangan', pkt.keterangan
            ) AS uraian,
            "PIUTANG KARYAWAN" AS sumber,
            pkt.enabled 
        FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = pkt.kode_akun_perkiraan 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
        WHERE pkt.enabled = 1
        AND kapt.enabled = 1
        UNION ALL
        SELECT 
            pkt.uuid,
            pkt.bukti_transaksi,
            LPAD(DAY(pkt.tanggal), 2, '0') AS tanggal,
            LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
            YEAR(pkt.tanggal) AS tahun,
            TIME(pkt.tanggal) AS waktu,
            1 AS transaksi,
            CASE 
                WHEN pkt.type = 1
                THEN pkt.nilai
                ELSE 0
            END AS debet,
            CASE 
                WHEN pkt.type = 0
                THEN pkt.nilai
                ELSE 0
            END AS kredit,
            kapt.code AS kode_akun,
            kapt.name AS nama_akun,
            kapt.type AS type_akun,
            JSON_OBJECT(
                'periode', pkt.periode,
                'pegawai_name', pt.name,
                'sumber', 'Piutang Pegawai',
                'keterangan', pkt.keterangan
            ) AS uraian,
            "PIUTANG KARYAWAN" AS sumber,
            pkt.enabled 
        FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
        JOIN ${generateDatabaseName(req_id)}.kode_akun_perkiraan_tab kapt ON kapt.uuid = "f15e2810-c736-42f6-9a80-6d70e03315de"
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
        WHERE pkt.enabled = 1
        AND kapt.enabled = 1
    `
}

export const payrollPegawaiNeracaSaldo = (req_id) => {
    return `
        SELECT 
            gt.kode_akun_perkiraan,
            LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
            YEAR(gt.tanggal) AS tahun,
            0 AS debet,
            gt.nilai AS kredit 
        FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
        WHERE gt.enabled = 1
        AND pt.enabled = 1
        UNION ALL 
        SELECT 
            "0c0a1c04-ad98-4818-9a63-9be554b2ae55" AS kode_akun_perkiraan,
            LPAD(MONTH(gt.tanggal), 2, '0') AS bulan,
            YEAR(gt.tanggal) AS tahun,
            gt.nilai AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.gaji_tab gt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = gt.pegawai 
        WHERE gt.enabled = 1
        AND pt.enabled = 1
        UNION ALL -- TUNJANGAN UANG START
        SELECT 
            "dc632a24-dba2-4c65-9b42-968de322fe1c" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.bonus + tut.insentif + tut.thr AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.bonus AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.insentif AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.thr AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "24af525c-4519-4f26-a339-df8ef261b42d" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.jp AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "24af525c-4519-4f26-a339-df8ef261b42d" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.jht AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "24af525c-4519-4f26-a339-df8ef261b42d" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.jkm AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "24af525c-4519-4f26-a339-df8ef261b42d" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.jkk AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jp AS debet 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jht AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jkm AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            tut.kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jkk AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "5555ff3a-9de0-42b5-bdc8-f39c43947496" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            tut.bpjs_kesehatan AS debet,
            0 AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "261984b1-4a45-4332-aaae-9687fe550262" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.bpjs_karyawan AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "261984b1-4a45-4332-aaae-9687fe550262" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jp_karyawan AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL
        SELECT 
            "261984b1-4a45-4332-aaae-9687fe550262" AS kode_akun_perkiraan,
            LPAD(MONTH(tut.tanggal), 2, '0') AS bulan,
            YEAR(tut.tanggal) AS tahun,
            0 AS debet,
            tut.jht_karyawan AS kredit 
        FROM ${generateDatabaseName(req_id)}.tunjangan_uang_tab tut
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = tut.pegawai 
        WHERE tut.enabled = 1
        UNION ALL -- LEMBUR START
        SELECT 
            lt.kode_akun_perkiraan,
            LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
            YEAR(lt.tanggal) AS tahun, 
            0 AS debet,
            lt.total_bayaran AS kredit
        FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
        WHERE lt.enabled = 1
        UNION ALL
        SELECT 
            "96dc1c2e-1cd3-42b8-b580-3932ebe1e82d" AS kode_akun_perkiraan,
            LPAD(MONTH(lt.tanggal), 2, '0') AS bulan,
            YEAR(lt.tanggal) AS tahun,
            lt.total_bayaran AS debet,
            0 AS kredit
        FROM ${generateDatabaseName(req_id)}.lembur_tab lt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = lt.pegawai 
        WHERE lt.enabled = 1
        UNION ALL -- HADIAH START
        SELECT 
            ht.kode_akun_perkiraan,
            LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
            YEAR(ht.tanggal) AS tahun,
            0 AS debet,
            ht.nilai AS kredit
        FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
        WHERE ht.enabled = 1
        UNION ALL 
        SELECT 
            "a09a5e0c-9544-4a83-b214-c47cf5c07bdd" AS kode_akun_perkiraan,
            LPAD(MONTH(ht.tanggal), 2, '0') AS bulan,
            YEAR(ht.tanggal) AS tahun,
            ht.nilai AS debet,
            0 AS kredit
        FROM ${generateDatabaseName(req_id)}.hadiah_tab ht 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ht.pegawai 
        WHERE ht.enabled = 1
        UNION ALL -- PPH2126 START
        SELECT 
            ppt.kode_akun_perkiraan,
            LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
            YEAR(ppt.tanggal) AS tahun,
            0 AS debet,
            ppt.nilai AS kredit
        FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
        WHERE pt.enabled = 1
        UNION ALL
        SELECT 
            "eadfec72-7d66-4597-998d-8acf959d34b7" AS kode_akun_perkiraan,
            LPAD(MONTH(ppt.tanggal), 2, '0') AS bulan,
            YEAR(ppt.tanggal) AS tahun,
            ppt.nilai AS debet,
            0 AS kredit
        FROM ${generateDatabaseName(req_id)}.pph2126_tab ppt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = ppt.pegawai 
        WHERE pt.enabled = 1
        UNION ALL -- LAIN LAIN START
        SELECT 
            llt.kode_akun_perkiraan,
            LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
            YEAR(llt.tanggal) AS tahun,
            0 AS debet,
            llt.nilai AS kredit
        FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
        WHERE llt.enabled = 1
        UNION ALL
        SELECT 
            "b7687ceb-6046-4062-979d-bfed5550bd87" AS kode_akun_perkiraan,
            LPAD(MONTH(llt.tanggal), 2, '0') AS bulan,
            YEAR(llt.tanggal) AS tahun,
            llt.nilai AS debet,
            0 AS kredit
        FROM ${generateDatabaseName(req_id)}.lain_lain_tab llt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = llt.pegawai 
        WHERE llt.enabled = 1
        UNION ALL -- KERUGIAN START
        SELECT 
            kt.kode_akun_perkiraan,
            LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
            YEAR(kt.tanggal) AS tahun,
            0 AS debet,
            kt.nilai AS kredit
        FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
        WHERE kt.enabled = 1
        UNION ALL
        SELECT 
            "f3eafc29-6a1c-4e57-b789-532b490dac33" AS kode_akun_perkiraan,
            LPAD(MONTH(kt.tanggal), 2, '0') AS bulan,
            YEAR(kt.tanggal) AS tahun,
            kt.nilai AS debet,
            0 AS kredit
        FROM ${generateDatabaseName(req_id)}.kerugian_tab kt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = kt.pegawai 
        WHERE kt.enabled = 1
        UNION ALL -- PIUTANG PEGAWAI START
        SELECT 
            pkt.kode_akun_perkiraan,
            LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
            YEAR(pkt.tanggal) AS tahun,
            CASE 
                WHEN pkt.type = 0
                THEN pkt.nilai
                ELSE 0
            END AS debet,
            CASE 
                WHEN pkt.type = 1
                THEN pkt.nilai
                ELSE 0
            END AS kredit
        FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
        WHERE pkt.enabled = 1
        UNION ALL
        SELECT 
            "f15e2810-c736-42f6-9a80-6d70e03315de" AS kode_akun_perkiraan,
            LPAD(MONTH(pkt.tanggal), 2, '0') AS bulan,
            YEAR(pkt.tanggal) AS tahun,
            CASE 
                WHEN pkt.type = 1
                THEN pkt.nilai
                ELSE 0
            END AS debet,
            CASE 
                WHEN pkt.type = 0
                THEN pkt.nilai
                ELSE 0
            END AS kredit
        FROM ${generateDatabaseName(req_id)}.piutang_karyawan_tab pkt 
        JOIN ${generateDatabaseName(req_id)}.pegawai_tab pt ON pt.uuid = pkt.pegawai 
        WHERE pkt.enabled = 1
    `
}