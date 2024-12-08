import { stokAwalBahanBakuValidation } from "./stokAwalBahanBaku.validation.js"
import { createStokAwalBahanBakuService, deleteStokAwalBahanBakuByUuidService, getAllStokAwalBahanBakuService, getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUIDService, getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDService, getReportStokAwalBahanBakusService, getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidService, getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidService, getStokAwalBahanBakuByBahanBakuUUIDService, updateStokAwalBahanBakuByUuidService } from "./stokAwalBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStokAwalBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStokAwalBahanBakuController", null, req.identity)
    try {
        const stokAwalBahanBakus = await getAllStokAwalBahanBakuService(req.query, req.identity)
        res.json({
            data: stokAwalBahanBakus,
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

export const getReportStokAwalBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getReportStokAwalBahanBakus", null, req.identity)
    try {
        const stokAwalBahanBakus = await getReportStokAwalBahanBakusService(req.params.bulan, req.params.tahun, req.query, req.identity)
        res.json({
            data: stokAwalBahanBakus,
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

export const getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUID", null, req.identity)
    try {
        const daftarGudangBahanBakus = await getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDService(req.params.kategori_harga_bahan_baku, req.identity)
        res.json({
            data: daftarGudangBahanBakus,
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

export const getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUID", null, req.identity)
    try {
        const daftarGudangBahanBakus = await getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUIDService(req.params.kategori_harga_bahan_baku, req.params.pesanan_penjualan_or_pembelian_bahan_baku, req.params.type, req.identity)
        res.json({
            data: daftarGudangBahanBakus,
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

export const getStokAwalBahanBakuByBahanBakuUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStokAwalBahanBakuByBahanBakuUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStokAwalBahanBakuByBahanBakuUUIDService(uuid, req.identity),
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

export const getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuid", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidService(uuid, req.identity),
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

export const getRiwayatTransaksiPembelianByStokAwalBahanBakuUuid = async (req, res) => {
    LOGGER(logType.INFO, "Start getRiwayatTransaksiPembelianByStokAwalBahanBakuUuid", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidService(uuid, req.identity),
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

export const postCreateStokAwalBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createStokAwalBahanBakuController", null, req.identity)
    try {
        const stokAwalBahanBakuData = req.body
        const { error, value } = stokAwalBahanBakuValidation(stokAwalBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const stokAwalBahanBaku = await createStokAwalBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, stokAwalBahanBaku, req.identity)
        res.json({
            data: stokAwalBahanBaku,
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

export const deleteStokAwalBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStokAwalBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStokAwalBahanBakuByUuidService(uuid, req.identity)
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

export const updateStokAwalBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStokAwalBahanBakuByUuidController", null, req.identity)
    try {
        const stokAwalBahanBakuData = req.body
        const { error, value } = stokAwalBahanBakuValidation(stokAwalBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStokAwalBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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