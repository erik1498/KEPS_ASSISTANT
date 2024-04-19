export const getNormalizedLabaKotorRugiKotor = (data) => {
    try {
        if (data.toString().indexOf("(") >= 0) return "Rugi Kotor"
    } catch (error) {
        console.log(error)
    } finally {
        return "Laba Kotor"
    }
}