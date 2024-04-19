export const getNormalizedLabaKotorRugiKotor = (data) => {
    try {
        data.toString().indexOf("(") >= 0 ? "Rugi Kotor" : "Laba Kotor"
    } catch (error) {
        console.log(error)
    } finally {
        return "Laba Kotor"
    }
}