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