export const DASHBOARD = (overview, penjualan, pembelian, biaya, aktivitas_dokumen) => {
    let selected = ["Dashboard"]
    if (overview) {
        selected.push("Dashboard_Overview")
    }
    if (penjualan) {
        selected.push("Dashboard_Penjualan")
    }
    if (pembelian) {
        selected.push("Dashboard_Pembelian")
    }
    if (biaya) {
        selected.push("Dashboard_Biaya")
    }
    if (aktivitas_dokumen) {
        selected.push("Dashboard_AktivitasDokumen")
    }
    return selected
}

export const PERUSAHAAN = (perusahaan_master, perusahaan_master_kode_akun, perusahaan_master_customer, perusahaan_master_supplier, perusahaan_master_pegawai, perusahaan_cabang, perusahaan_divisi, perusahaan_jabatan, perusahaan_tipe_pembayaran, perusahaan_syarat_pembayaran, perusahaan_status_tanggungan) => {
    let selected = ["Perusahaan"]
    if (perusahaan_master) {
        selected.push("Perusahaan_Master")
    }
    if (perusahaan_master_kode_akun) {
        selected.push("Perusahaan_Master_KodeAkun")
    }
    if (perusahaan_master_customer) {
        selected.push("Perusahaan_Master_Customer")
    }
    if (perusahaan_master_supplier) {
        selected.push("Perusahaan_Master_Supplier")
    }
    if (perusahaan_master_pegawai) {
        selected.push("Perusahaan_Master_Pegawai")
    }
    if (perusahaan_cabang) {
        selected.push("Perusahaan_Cabang")
    }
    if (perusahaan_divisi) {
        selected.push("Perusahaan_Divisi")
    }
    if (perusahaan_jabatan) {
        selected.push("Perusahaan_Jabatan")
    }
    if (perusahaan_tipe_pembayaran) {
        selected.push("Perusahaan_TipePembayaran")
    }
    if (perusahaan_syarat_pembayaran) {
        selected.push("Perusahaan_SyaratPembayaran")
    }
    if (perusahaan_status_tanggungan) {
        selected.push("Perusahaan_StatusTanggungan")
    }
    return selected
}

export const TRANSAKSI = (kas_dan_bank, penjualan, penjualan_barang, penjualan_jasa, pembelian, pembelian_barang, payroll, payroll_pendapatan_pegawai, payroll_potongan_pegawai, payroll_slip_gaji_pegawai) => {
    let selected = ["Transaksi"]
    if (kas_dan_bank) {
        selected.push("Transaksi_KasDanBank")
    }
    if (penjualan) {
        selected.push("Transaksi_Penjualan")
    }
    if (penjualan_barang) {
        selected.push("Transaksi_Penjualan_Barang")
    }
    if (penjualan_jasa) {
        selected.push("Transaksi_Penjualan_Jasa")
    }
    if (pembelian) {
        selected.push("Transaksi_Pembelian")
    }
    if (pembelian_barang) {
        selected.push("Transaksi_Pembelian_barang")
    }
    if (payroll) {
        selected.push("Transaksi_Payroll")
    }
    if (payroll_pendapatan_pegawai) {
        selected.push("Transaksi_Payroll_PendapatanPegawai")
    }
    if (payroll_potongan_pegawai) {
        selected.push("Transaksi_Payroll_PotonganPegawai")
    }
    if (payroll_slip_gaji_pegawai) {
        selected.push("Transaksi_Payroll_SlipGajiPegawai")
    }
    return selected
}

export const BUKU_BESAR = (jurnal_umum, history_akun) => {
    let selected = ["BukuBesar"]
    if (jurnal_umum) {
        selected.push("BukuBesar_JurnalUmum")
    }
    if (history_akun) {
        selected.push("BukuBesar_HistoryAkun")
    }
    return selected
}

export const LAPORAN = (neraca_saldo, laba_rugi, neraca, perubahan_modal) => {
    let selected = ["Laporan"]
    if (neraca_saldo) {
        selected.push("Laporan_NeracaSaldo")
    }
    if (laba_rugi) {
        selected.push("Laporan_LabaRugi")
    }
    if (neraca) {
        selected.push("Laporan_Neraca")
    }
    if (perubahan_modal) {
        selected.push("Laporan_PerubahanModal")
    }
    return selected
}
