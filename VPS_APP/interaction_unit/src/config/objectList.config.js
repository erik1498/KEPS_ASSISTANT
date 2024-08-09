export const objectListDetail = (title,
    content) => ({
        title,
        content
    });

export const yearList = () => {
    let arrayYear = []
    for (let index = 2024; index <= new Date().getFullYear(); index++) {
        arrayYear.push({
            value: index
        })
    }
    return arrayYear;
}

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


export const Agama = () => {
    return [
        {
            name: "Islam"
        },
        {
            name: "Kristen Katholik"
        },
        {
            name: "Kristen Protestan"
        },
        {
            name: "Hindu"
        },
        {
            name: "Buddha"
        },
        {
            name: "Konghucu"
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
                ]
            },
            {
                title: "Jual Beli",
                data: [
                    {
                        title: "Kuasa Untuk Menjual"
                    },
                    {
                        title: "Kuasa Untuk Membeli"
                    },
                    {
                        title: "PPJB"
                    },
                    {
                        title: "PJB"
                    },
                    {
                        title: "Kesepakatan Bersama"
                    },
                ]
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
                title: "Waarmerking",
            },
            {
                title: "Legalisasi",
            },
            {
                title: "Persetujuan Dan Kuasa",
            },
            {
                title: "Pernyataan",
            },
            {
                title: "SKMHT",
            }
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
                title: "Pemasukan Modal Dalam Perusahaan",
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
            }
        ]
    },
    {
        title: "Lain - Lain",
        data: [
            {
                title: "Pengurusan Rekon Bidang Tanah",
            },
            {
                title: "Pendaftaran Tanah Pertama Kali",
            },
            {
                title: "Pindah KTP",
            },
            {
                title: "KKPR",
            },
            {
                title: "Legalisir",
            },
            {
                title: "Turun Hak",
            },
            {
                title: "Naik Hak",
            },
            {
                title: "Pemecahan / Pemisahan",
            },
            {
                title: "Ploting",
            },
            {
                title: "Ganti Blanko",
            },
            {
                title: "IPPT",
            },
        ]
    }
]

export const pegawaiList = [
    {
        nama: "Doni Saputra"
    },{
        nama: "Marselinus Yansen"
    },{
        nama: "Doroteus Kuri"
    },{
        nama: "Katarina Lilia Since"
    },{
        nama: "Germana Cicit Wahyuni"
    },{
        nama: "Rusnawati"
    },{
        nama: "Yuliana Prisnawati Siboe"
    },{
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