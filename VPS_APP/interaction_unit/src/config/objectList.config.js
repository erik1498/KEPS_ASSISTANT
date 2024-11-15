// START COMPANY CONFIG

export const AKUN_TIDAK_BOLEH_DIUPDATE = ["101", "102", "301", "302", "303", "398", "399", "401", "405", "701", "702", "799"]

export const PAYROLLPENDAPATANPOTONGANSUMBERLIST = [
    "GAJI PEGAWAI",
    "TUNJANGAN UANG PEGAWAI",
    "LEMBUR PEGAWAI",
    "HADIAH PEGAWAI",
    "PPH 21/26",
    "LAIN - LAIN",
    "KERUGIAN",
    "PIUTANG KARYAWAN"
]

export const PERINTAHSTOKOPNAMESUMBERLIST = [
    "PERINTAH STOK OPNAME",
    "FAKTUR PENJUALAN BARANG",
    "FAKTUR PEMBELIAN BARANG",
    "PELUNASAN PENJUALAN BARANG",
    "PELUNASAN DENDA PENJUALAN BARANG",
    "RETUR PENJUALAN BARANG",
    "PENGEMBALIAN DENDA PENJUALAN BARANG",
    "DENDA PENJUALAN BARANG",
]

export const tipeDokumenList = [
    {
        title: "Notaris",
        data: [
            {
                title: "Badan Hukum",
                data: [
                    {
                        title: "Perseroan Terbatas"
                    },
                    {
                        title: "Yayasan"
                    },
                    {
                        title: "Lembaga / Perkumpulan"
                    },
                    {
                        title: "Koperasi"
                    }
                ]
            },
            {
                title: "Badan Usaha",
                data: [
                    {
                        title: "Perseroan Komanditer"
                    },
                    {
                        title: "UD"
                    },
                    {
                        title: "Firma"
                    },
                    {
                        title: "Lembaga / Perkumpulan Non-Badan Hukum"
                    }
                ]
            },
            {
                title: "Pengikatan Jual Beli ( PJB ) Lunas",
            },
            {
                title: "Sewa Menyewa",
            },
            {
                title: "Hibah",
            },
            {
                title: "Waris",
            },
            {
                title: "Fidusia",
            },
            {
                title: "Waarmerking Surat Dibawah Tangan",
            },
            {
                title: "Legalisasi Surat Dibawah Tangan",
            },
            {
                title: "Persetujuan Dan Kuasa",
            },
            {
                title: "SKMHT ( Surat Kuasa Membebankan Hak Tanggungan )",
            },
            {
                title: "Penegasan Perseroan Terbatas Perorangan (PT. PERORANGAN)"
            },
            {
                title: "Kuasa Untuk Menjual"
            },
            {
                title: "Kuasa Untuk Membeli"
            },
            {
                title: "Perjanjian Pengikatan Jual Beli (PPJB)"
            },
            {
                title: "Pernyataan",
            },
            {
                title: "Akta Lainnya",
            },
        ]
    },
    {
        title: "PPAT",
        data: [
            {
                title: "Akta Jual Beli",
            },
            {
                title: "Akta Hibah",
            },
            {
                title: "Akta Pemberian Hak Tanggungan",
            },
            {
                title: "Akta Pembagian Hak Bersama",
            },
            {
                title: "SKMHT",
            },
            {
                title: "Akta Peralihan Hak Pewarisan",
            },
            {
                title: "Akta Peralihan Tukar Menukar",
            },
            {
                title: "Pemasukan Modal Dalam Perusahaan (INBRENG)",
            },
            {
                title: "Reorganisasi Atau Restruktur Perseroan",
            },
            {
                title: "Perubahan Data Berdasarkan Penetapan Atau Putusan Pengadilan",
            },
            {
                title: "Pengalihan Hak Lelang",
            },
            {
                title: "Cessie",
            },
            {
                title: "Subrogasi",
            },
            {
                title: "Roya",
            },
            {
                title: "Roya Elektonik Perorangan",
            },
            {
                title: "Merger Hak Tanggungan",
            },
            {
                title: "Akta Lainnya",
            }
        ]
    },
    {
        title: "Lain - Lain",
        data: [
            {
                title: "Kesepakatan Bersama Jual Beli Dibawah Tangan"
            },
            {
                title: "Pendaftaran Tanah Pertama Kali",
            },
            {
                title: "Jasa Penanganan Pengecekan Lokasi Tanah",
            },
            {
                title: "PKKPR Otomatis"
            },
            {
                title: "Legalisasi"
            },
            {
                title: "Turun Hak"
            },
            {
                title: "Naik Hak"
            },
            {
                title: "Pemecahan/Pemisahan",
            },
            {
                title: "Ploting Bidang Tanah",
            },
            {
                title: "Ganti Blanko Sertifikat Tanah",
            },
            {
                title: "IPPT/ASPEK",
            },
            {
                title: "Pengurusan Rekon Bidang Tanah",
            },
            {
                title: "Jasa Pengurusan Tata Ruang",
            },
            {
                title: "Jasa Pengurusan HAKI",
            },
            {
                title: "Pengurusan IMB/PBG",
            },
            {
                title: "Verifikasi Sertifikat Standar",
            },
            {
                title: "Turun Waris"
            },
            {
                title: "Blanko Permohonan Jasa Pengurusan BPJP"
            },
            {
                title: "Permohonan Pengurusan NPWP dan Kuasa"
            },
            {
                title: "Surat Keterangan Domisili, Permohonan Dan Kuasa"
            },
            {
                title: "Jasa Pengurusan Penerjemah Tersumpah Untuk PT. Asing dan PT. Lokal"
            },
            {
                title: "Blanko Permohonan dan Kuasa Pengurusan KTP dan KARTU KELUARGA"
            },
            {
                title: "Blanko Kwitansi dan Tanda Terima ( PAKAI NOMOR )"
            },
            {
                title: "Mediasi"
            },
            {
                title: "Jasa Pengurusan Surat Keterangan Domisili Perseroan Terbatas dan Pribadi"
            },
            {
                title: "PPKPR Perorangan"
            },
            {
                title: "KKPR Non Berusaha"
            },
            {
                title: "Perjanjian"
            },
            {
                title: "Jasa Pengurusan Blanko PBB"
            },
            {
                title: "Waarmerking"
            },
            {
                title: "Jasa Lainya"
            },
        ]
    }
]

export const pegawaiList = [
    {
        nama: "Doni Saputra"
    }, {
        nama: "Marselinus Yansen"
    }, {
        nama: "Doroteus Kuri"
    }, {
        nama: "Katarina Lilia Since"
    }, {
        nama: "Germana Cicit Wahyuni"
    }, {
        nama: "Rusnawati"
    }, {
        nama: "Yuliana Prisnawati Siboe"
    }, {
        nama: "Aprianus Mario Deno"
    },
]

export const statusAktivitasDokumenList = [
    {
        nama: "Mulai"
    },
    {
        nama: "Dalam Proses"
    },
    {
        nama: "Selesai"
    }
]

// END COMPANY CONFIG

export const objectListDetail = (title,
    content) => ({
        title,
        content
    });

export const yearList = () => {
    let arrayYear = []
    for (let index = 2024; index <= new Date().getFullYear() + 2; index++) {
        arrayYear.push({
            value: index
        })
    }
    return arrayYear;
}

export const kodeHargaList = [
    {
        label: "Harga Beli",
        value: "beli"
    },
    {
        label: "Harga 1",
        value: "1"
    },
    {
        label: "Harga 2",
        value: "2"
    },
    {
        label: "Harga 3",
        value: "3"
    },
    {
        label: "Harga 4",
        value: "4"
    },
    {
        label: "Harga 5",
        value: "5"
    },
]

export const jenisKelaminList = [
    {
        label: "Laki - Laki",
        value: "1"
    },
    {
        label: "Perempuan",
        value: "0"
    },
]

export const statusKerjaList = [
    {
        label: "Tetap",
        value: "Tetap"
    },
    {
        label: "Kontrak",
        value: "Kontrak"
    },
    {
        label: "Tenaga Ahli",
        value: "Tenaga Ahli"
    }
]

export const agamaList = [
    {
        label: "Kristen Katholik",
        value: "Kristen Katholik"
    },
    {
        label: "Kristen Protestan",
        value: "Kristen Protestan"
    },
    {
        label: "Islam",
        value: "Islam"
    },
    {
        label: "Hindu",
        value: "Hindu"
    },
    {
        label: "Budha",
        value: "Budha"
    },
    {
        label: "Konghucu",
        value: "Konghucu"
    },
]

export const KodeAkunType = () => {
    return [
        {
            name: "Harta"
        },
        {
            name: "Utang"
        },
        {
            name: "Modal"
        },
        {
            name: "Pendapatan"
        },
        {
            name: "Beban Operasional"
        },
        {
            name: "Pendapatan Lain - Lain"
        },
        {
            name: "Harga Pokok Penjualan"
        },
        {
            name: "Beban Lainnya"
        }
    ]
}

export const JenisKelamin = () => {
    return [
        {
            name: "Perempuan",
            value: 0
        },
        {
            name: "Laki - Laki",
            value: 1
        },
    ]
}

export const PPNList = [
    {
        label: "Ya",
        value: 1
    }, {
        label: "Tidak",
        value: 0
    }
]

export const TipeTransaksi = [
    {
        label: "Masuk",
        value: 1
    },
    {
        label: "Keluar",
        value: 0
    }
]

export const TipeTransaksiKasBankKodeAkunForm = [
    {
        label: "Tidak Keduannya",
        value: 0
    },
    {
        label: "Kas",
        value: 1
    },
    {
        label: "Bank",
        value: 2
    }
]

export const TipeTransaksiPayrollKodeAkunForm = [
    {
        label: "Tidak",
        value: 0
    },
    {
        label: "Ya",
        value: 1
    }
]


export const PPN = 11
export const BPJSKesehatanPersentase = (4 / 100).toFixed(5)
export const JKKPersentase = (0.24 / 100).toFixed(5)
export const JKMPersentase = (0.30 / 100).toFixed(5)
export const JHTPersentase = (3.7 / 100).toFixed(5)
export const JPPersentase = (2 / 100).toFixed(5)

export const BPJSKaryawanPersentase = (1 / 100).toFixed(5)
export const JHTKaryawanPersentase = (2 / 100).toFixed(5)
export const JPKaryawanPersentase = (1 / 100).toFixed(5)

export const TipePiutangKaryawan = [
    {
        label: "Keluar",
        value: 0
    },
    {
        label: "Masuk",
        value: 1
    },
]