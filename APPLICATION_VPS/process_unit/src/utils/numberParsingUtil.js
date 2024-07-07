export const removeDotInRupiahInput = (data, keys) => {
    keys.map((item) => {
        data[item] = String(data[item]).replaceAll(",", "")
    })
    return data
}

export const generateToRupiahText = (data, keys) => {
    let parse = [] 
    keys.map((item) => {
        parse[item] = parseToRupiahText(data[item])
    })
    Object.keys(data).map((item) => {
        if (keys.indexOf(item) < 0) {
            parse[item] = data[item]
        }
    })
    return parse
}

export const parseToRupiahText = (value) => {
    if (value == null || value == "" || value == 0) {
        return value
    }
    value = String(value)
    let split = value.split(".")
    if (split.length == 2) {        
        return split[0].replaceAll(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "." + split[1];
    }
    let hasil = value.replaceAll(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (hasil.at(0) == "0") {
        hasil = hasil.slice(1, hasil.length)
    }
    return hasil
}