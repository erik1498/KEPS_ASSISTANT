import { fakturPenjualanBarangValidation } from "./fakturPenjualanBarang.validation.js"
import { createFakturPenjualanBarangService, deleteFakturPenjualanBarangByUuidService, getAllFakturPenjualanBarangService, getFakturPenjualanBarangByPesananPenjualanBarangUUIDService, getFakturPenjualanBarangByUuidService, updateFakturPenjualanBarangByUuidService } from "./fakturPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllFakturPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllFakturPenjualanBarangController", null, req.identity)
    try {
        const fakturPenjualanBarangs = await getAllFakturPenjualanBarangService(req.query, req.identity)
        res.json({
            data: fakturPenjualanBarangs,
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

export const getFakturPenjualanBarangByPesananPenjualanBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPenjualanBarangByPesananPenjualanBarangUUID", null, req.identity)
    try {
        const { pesanan_penjualan_barang_uuid } = req.params

        res.json({
            data: await getFakturPenjualanBarangByPesananPenjualanBarangUUIDService(pesanan_penjualan_barang_uuid, req.identity),
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

export const getFakturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getFakturPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreateFakturPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createFakturPenjualanBarangController", null, req.identity)
    try {
        const fakturPenjualanBarangData = req.body
        const { error, value } = fakturPenjualanBarangValidation(fakturPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const fakturPenjualanBarang = await createFakturPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, fakturPenjualanBarang, req.identity)
        res.json({
            data: fakturPenjualanBarang,
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

export const deleteFakturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteFakturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteFakturPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateFakturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateFakturPenjualanBarangByUuidController", null, req.identity)
    try {
        const fakturPenjualanBarangData = req.body
        const { error, value } = fakturPenjualanBarangValidation(fakturPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateFakturPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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