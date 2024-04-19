export const getNormalizedLabaKotorRugiKotor = (data) => {
    if (data.indexOf("(") >= 0) 
        return "Rugi Kotor"
    
    return "Laba Kotor"
}