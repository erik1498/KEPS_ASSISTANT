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
    let totalBeforeTitik = data.map(i => parseFloat(i.toString().split(".")[0])).reduce((prev, curr) => curr + prev)
    let totalAfterTitik = data.map(i => i.toString().split(".")[1] ? parseFloat(i.toString().split(".")[1]) : 0).reduce((prev, curr) => curr + prev)

    totalBeforeTitik += totalAfterTitik > 99 ? parseFloat(totalAfterTitik.toString().at(0)) : 0;
    totalAfterTitik = totalAfterTitik % 100

    return totalAfterTitik > 0 ? `${totalBeforeTitik}.${totalAfterTitik}` : `${totalBeforeTitik}`
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