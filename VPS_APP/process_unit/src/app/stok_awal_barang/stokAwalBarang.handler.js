import { stokAwalBarangValidation } from "./stokAwalBarang.validation.js"
import { createStokAwalBarangService, deleteStokAwalBarangByUuidService, getAllStokAwalBarangService, getDaftarGudangBarangByKategoriHargaBarangUUIDService, getStokAwalBarangByBarangUUIDService, updateStokAwalBarangByUuidService } from "./stokAwalBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStokAwalBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStokAwalBarangController", null, req.identity)
    try {
        const stokAwalBarangs = await getAllStokAwalBarangService(req.query, req.identity)
        res.json({
            data: stokAwalBarangs,
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

export const getDaftarGudangBarangByKategoriHargaBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarGudangBarangByKategoriHargaBarangUUID", null, req.identity)
    try {
        const daftarGudangBarangs = await getDaftarGudangBarangByKategoriHargaBarangUUIDService(req.params.kategori_harga_barang, req.identity)
        res.json({
            data: daftarGudangBarangs,
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

export const getStokAwalBarangByBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStokAwalBarangByBarangUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStokAwalBarangByBarangUUIDService(uuid, req.identity),
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

export const postCreateStokAwalBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createStokAwalBarangController", null, req.identity)
    try {
        const stokAwalBarangData = req.body
        const { error, value } = stokAwalBarangValidation(stokAwalBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const stokAwalBarang = await createStokAwalBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, stokAwalBarang, req.identity)
        res.json({
            data: stokAwalBarang,
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

export const deleteStokAwalBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStokAwalBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStokAwalBarangByUuidService(uuid, req.identity)
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

export const updateStokAwalBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStokAwalBarangByUuidController", null, req.identity)
    try {
        const stokAwalBarangData = req.body
        const { error, value } = stokAwalBarangValidation(stokAwalBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStokAwalBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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