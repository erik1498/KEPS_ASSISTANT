import { LOGGER, logType } from "./loggerUtil.js"


const MODAL_TYPE = "Modal"
const HARTA_TYPE = "Harta"
const UTANG_TYPE = "Utang"
export const getJurnalUmumNeracaReport = (data, laba_rugi_data) => {
    let resultAset = []
    let resultAsetCount = 0.0

    let resultUtang = []
    let resultUtangCount = 0.0

    let resultModal = []
    let resultModalCount = 0.0

    for (let i = 0; i < data.length; i++) {
        if (data[i].type_akun == HARTA_TYPE) {
            resultAset.push({
                kodeName: data[i].kode_akun + " - " + data[i].nama_akun,
                name: data[i].nama_akun,
                uraian: data[i].uraian,
                debet: parseFloat(data[i].debet),
                kredit: parseFloat(data[i].kredit),
            })
            resultAsetCount += (parseFloat(data[i].debet) - parseFloat(data[i].kredit))
        }
        if (data[i].type_akun == UTANG_TYPE) {
            resultUtang.push({
                kodeName: data[i].kode_akun + " - " + data[i].nama_akun,
                name: data[i].nama_akun,
                uraian: data[i].uraian,
                debet: parseFloat(data[i].debet),
                kredit: parseFloat(data[i].kredit),
            })
            resultUtangCount += (parseFloat(data[i].debet) - parseFloat(data[i].kredit))
        }
        if (data[i].type_akun == MODAL_TYPE) {
            resultModal.push({
                kodeName: data[i].kode_akun + " - " + data[i].nama_akun,
                name: data[i].nama_akun,
                uraian: data[i].uraian,
                debet: parseFloat(data[i].debet),
                kredit: parseFloat(data[i].kredit),
            })
            resultModalCount += (parseFloat(data[i].debet) - parseFloat(data[i].kredit))
        }
    }
    // laba_rugi_data.laba_rugi.loss
    const labaTahunBerjalan = laba_rugi_data.laba_rugi.loss > 0 ? {
        kodeName: "306 - Laba Periode Berjalan",
        name: "Laba Periode Berjalan",
        uraian: "",
        debet: laba_rugi_data.laba_rugi.loss,
        kredit: 0
    } : {
        kodeName: "307 - Rugi Periode Berjalan",
        name: "Rugi Periode Berjalan",
        uraian: "",
        debet: 0,
        kredit: Math.abs(laba_rugi_data.laba_rugi.loss)
    }
    resultModal.push(labaTahunBerjalan)
    resultModalCount += (parseFloat(labaTahunBerjalan.debet) - parseFloat(labaTahunBerjalan.kredit))
    return {
        harta: {
            data: resultAset,
            count: resultAsetCount
        },
        utang: {
            data: resultUtang,
            count: resultUtangCount
        },
        modal: {
            data: resultModal,
            count: resultModalCount
        },
        neraca: {
            aktiva: resultAsetCount,
            pasiva: resultUtangCount + resultModalCount,
            difference: Math.abs(resultAsetCount) - Math.abs((resultUtangCount + resultModalCount))
        }
    }
}