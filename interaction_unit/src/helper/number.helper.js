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
    return parseFloat(e.toString().replaceAll(",", "").replaceAll("(", "").replaceAll(")", ""))
}

export const getRandom = (length) => {
    return Array(length).fill(0).map(() => Math.floor(Math.random() * 100))
}

export const getArray = (length) => {
    return Array(length).fill(null);
}