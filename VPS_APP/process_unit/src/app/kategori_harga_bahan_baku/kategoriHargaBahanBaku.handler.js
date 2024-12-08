import { kategoriHargaBahanBakuValidation } from "./kategoriHargaBahanBaku.validation.js"
import { createKategoriHargaBahanBakuService, deleteKategoriHargaBahanBakuByUuidService, getAllKategoriHargaBahanBakuService, getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportService, getKategoriHargaBahanBakuByUuidService, updateKategoriHargaBahanBakuByUuidService } from "./kategoriHargaBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriHargaBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaBahanBakuController", null, req.identity)
    try {
        const kategoriHargaBahanBakus = await getAllKategoriHargaBahanBakuService(req.params.daftar_bahan_baku, req.query, req.identity)
        res.json({
            data: kategoriHargaBahanBakus,
            message: "Get Data Success"
        })
    } catch (error) {    
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReport = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaBahanBakuController", null, req.identity)
    try {
        const kategoriHargaBahanBakus = await getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportService(req.params.daftar_bahan_baku, req.params.satuan_bahan_baku, req.identity)
        res.json({
            data: kategoriHargaBahanBakus,
            message: "Get Data Success"
        })
    } catch (error) {    
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const postCreateKategoriHargaBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriHargaBahanBakuController", null, req.identity)
    try {
        const kategoriHargaBahanBakuData = req.body
        const { error, value } = kategoriHargaBahanBakuValidation(kategoriHargaBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriHargaBahanBaku = await createKategoriHargaBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriHargaBahanBaku, req.identity)
        res.json({
            data: kategoriHargaBahanBaku,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const deleteKategoriHargaBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriHargaBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriHargaBahanBakuByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const updateKategoriHargaBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriHargaBahanBakuByUuidController", null, req.identity)
    try {    
        const kategoriHargaBahanBakuData = req.body
        const { error, value } = kategoriHargaBahanBakuValidation(kategoriHargaBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriHargaBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}