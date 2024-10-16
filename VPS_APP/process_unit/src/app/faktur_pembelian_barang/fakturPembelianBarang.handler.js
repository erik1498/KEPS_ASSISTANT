import { fakturPembelianBarangValidation } from "./fakturPembelianBarang.validation.js"
import { createFakturPembelianBarangService, deleteFakturPembelianBarangByUuidService, getAllFakturPembelianBarangService, getFakturPembelianBarangByPesananPembelianBarangUUIDService, getFakturPembelianBarangByUuidService, getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDService, updateFakturPembelianBarangByUuidService } from "./fakturPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllFakturPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllFakturPembelianBarangController", null, req.identity)
    try {
        const fakturPembelianBarangs = await getAllFakturPembelianBarangService(req.query, req.identity)
        res.json({
            data: fakturPembelianBarangs,
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

export const getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUID", null, req.identity)
    try {
        const riwayatTransaksi = await getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDService(req.params.uuid, req.identity)
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

export const getFakturPembelianBarangByPesananPembelianBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPembelianBarangByPesananPembelianBarangUUID", null, req.identity)
    try {
        const { pesanan_pembelian_barang_uuid } = req.params

        res.json({
            data: await getFakturPembelianBarangByPesananPembelianBarangUUIDService(pesanan_pembelian_barang_uuid, req.identity),
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

export const getFakturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getFakturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getFakturPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreateFakturPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createFakturPembelianBarangController", null, req.identity)
    try {
        const fakturPembelianBarangData = req.body
        const { error, value } = fakturPembelianBarangValidation(fakturPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const fakturPembelianBarang = await createFakturPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, fakturPembelianBarang, req.identity)
        res.json({
            data: fakturPembelianBarang,
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

export const deleteFakturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteFakturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteFakturPembelianBarangByUuidService(uuid, req.identity)
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

export const updateFakturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateFakturPembelianBarangByUuidController", null, req.identity)
    try {
        const fakturPembelianBarangData = req.body
        const { error, value } = fakturPembelianBarangValidation(fakturPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateFakturPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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