export const generatePerubahanModalDataChart = (data) => {
    let bgColor = data.map(item => {
        return item <= 0 ? `rgba(127, 29, 29, 1)` : `rgba(30, 58, 138, 1)`
    })

    return {
        label: 'Saldo',
        data,
        backgroundColor: bgColor,
    }
}