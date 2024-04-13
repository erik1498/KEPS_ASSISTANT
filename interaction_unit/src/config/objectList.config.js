export const objectListDetail = (title,
    content) => ({
        title,
        content
    });

export const yearList = () => {
    let arrayYear = []
    for (let index = 2024; index <= new Date().getFullYear() + 4; index++) {
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