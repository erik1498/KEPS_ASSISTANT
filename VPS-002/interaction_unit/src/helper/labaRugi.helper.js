export const getNormalizedLabaKotorRugiKotor = (data) => {
    try {
        return data.toString().indexOf("(") >= 0 ? "Rugi Kotor" : "Laba Kotor"
    } catch (error) {
        return "Laba Kotor"
    }
}