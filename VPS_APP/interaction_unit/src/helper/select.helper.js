export const convertDataToSelectOptions = (data, label, value, labelIsArray = false, delimiterLabel) => {
    let options = []
    data.map((e) => {
        options.push({
            value: e[value],
            label: labelIsArray ? concatLabel(e, label, delimiterLabel) : e[label]
        })
    })
    return options
}

const concatLabel = (data, labelData, delimiterLabel) => {
    let concat = ""
    labelData.map((item, i) => {
        concat += i > 0 ? ` ${delimiterLabel} ${data[item]}` : data[item]
    })
    return concat
}

export const initialKodeAkunValue = () => {
    return {
        label: " - - Belum Terpilih",
        value: ""
    }
}

export const initialDataFromEditObject = ({
    editObject,
    dataList,
    setState = () => { },
    labelKey,
    valueKey
}) => {
    const dataGet = dataList.filter(x => x[`${valueKey}`] == editObject)
    if (dataGet.length > 0) {
        setState({
            label: dataGet[0][`${labelKey}`],
            value: dataGet[0][`${valueKey}`],
        })
    }
}