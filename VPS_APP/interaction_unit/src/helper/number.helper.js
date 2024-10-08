export const parseToRupiahText = (value) => {
    if (value == null || value == "" || value == 0) {
        return value
    }
    value = String(value)
    let split = value.split(".")
    if (split.length == 2) {
        return split[0].replaceAll(",", "").replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',') + "." + split[1];
    }
    let hasil = value.replaceAll(",", "").replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (hasil.at(0) == "0") {
        hasil = hasil.slice(1, hasil.length)
    }
    return hasil
}

const convertToWords = (n) => {
    const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    if (n < 12) {
        return satuan[n];
    } else if (n < 20) {
        return convertToWords(n - 10) + ' belas';
    } else if (n < 100) {
        return convertToWords(Math.floor(n / 10)) + ' puluh ' + convertToWords(n % 10);
    } else if (n < 200) {
        return 'seratus ' + convertToWords(n - 100);
    } else if (n < 1000) {
        return convertToWords(Math.floor(n / 100)) + ' ratus ' + convertToWords(n % 100);
    } else if (n < 2000) {
        return 'seribu ' + convertToWords(n - 1000);
    } else if (n < 1000000) {
        return convertToWords(Math.floor(n / 1000)) + ' ribu ' + convertToWords(n % 1000);
    } else if (n < 1000000000) {
        return convertToWords(Math.floor(n / 1000000)) + ' juta ' + convertToWords(n % 1000000);
    } else if (n < 1000000000000) {
        return convertToWords(Math.floor(n / 1000000000)) + ' miliar ' + convertToWords(n % 1000000000);
    } else if (n < 1000000000000000) {
        return convertToWords(Math.floor(n / 1000000000000)) + ' triliun ' + convertToWords(n % 1000000000000);
    }
}

export const keTerbilang = (num) => {
    let minus = false
    if (num < 0) {
        minus = true
    }
    num = Math.abs(num)

    return num === 0 ? 'nol' : `${minus ? "minus" : ""} ${convertToWords(num).trim()}`;
}

export const parseRupiahToFloat = (e) => {
    try {
        return parseFloat(e.toString().replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""))
    } catch (error) {
        return 0
    }
}

export const getSumOfStringValue = (data) => {
    try {
        const total = data.reduce((accumulator, currentValue) => {
            const angka = parseFloat(currentValue);
            return accumulator + angka
        }, 0); // Nilai awal akumulator adalah 0

        return total.toFixed(2).toString().split(".")[1] == "00" ? total : total.toFixed(2)
    } catch (error) {
        return 0
    }
}

export const getRandom = (length) => {
    return Array(length).fill(0).map(() => Math.floor(Math.random() * 100))
}

export const getArray = (length) => {
    return Array(length).fill(null);
}

export const sumArray = (array) => {
    let sum = 0
    if (array) {
        array.map(i => sum += i)
    }
    return sum
}