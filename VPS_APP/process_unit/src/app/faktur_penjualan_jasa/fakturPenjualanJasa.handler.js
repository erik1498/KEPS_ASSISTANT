import { fakturPenjualanJasaValidation } from "./fakturPenjualanJasa.validation.js"
import { createFakturPenjualanJasaService, deleteFakturPenjualanJasaByUuidService, getAllFakturPenjualanJasaService, getFakturPenjualanJasaByPesananPenjualanJasaUUIDService, getFakturPenjualanJasaByUuidService, getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDService, updateFakturPenjualanJasaByUuidService } from "./fakturPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllFakturPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllFakturPenjualanJasaController", null, req.identity)
    try {
        const fakturPenjualanJasas = await getAllFakturPenjualanJasaService(req.query, req.identity)
        res.json({
            data: fakturPenjualanJasas,
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

export const getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUID", null, req.identity)
    try {
        const riwayatTransaksi = await getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDService(req.params.uuid, req.identity)
        res.json({
            data: riwayatTransaksi,
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

export const getFakturPenjualanJasaByPesananPenjualanJasaUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPenjualanJasaByPesananPenjualanJasaUUID", null, req.identity)
    try {
        const { pesanan_penjualan_jasa_uuid } = req.params

        res.json({
            data: await getFakturPenjualanJasaByPesananPenjualanJasaUUIDService(pesanan_penjualan_jasa_uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getFakturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getFakturPenjualanJasaByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const postCreateFakturPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createFakturPenjualanJasaController", null, req.identity)
    try {
        const fakturPenjualanJasaData = req.body
        const { error, value } = fakturPenjualanJasaValidation(fakturPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const fakturPenjualanJasa = await createFakturPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, fakturPenjualanJasa, req.identity)
        res.json({
            data: fakturPenjualanJasa,
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

export const deleteFakturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteFakturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteFakturPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateFakturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateFakturPenjualanJasaByUuidController", null, req.identity)
    try {
        const fakturPenjualanJasaData = req.body
        const { error, value } = fakturPenjualanJasaValidation(fakturPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateFakturPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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