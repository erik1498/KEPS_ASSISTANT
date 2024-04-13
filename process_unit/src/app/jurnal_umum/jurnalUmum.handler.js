import { jurnalUmumValidation } from "./jurnalUmum.validation.js"
import { createJurnalUmumService, deleteJurnalUmumByBuktiTransaksiService, deleteJurnalUmumByUuidService, getJurnalUmumByBulanService, updateJurnalUmumByUuidService } from "./jurnalUmum.services.js"
import { bulanTahunValidation, generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getLoggerData } from "../logger/logger.services.js"
import { encryptFile } from "../../utils/encryptUtil.js"
import { getEnv } from "../../utils/envUtils.js"

export const getAllJurnalUmumByBulanAndTypeSorting = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJurnalUmumByBulanAndTypeSortingController", null, req.identity)
    try {
        const { sorting } = req.params
        const { error, value } = bulanTahunValidation({ bulan: req.params.bulan, tahun: req.params.tahun })

        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }

        const { bulan, tahun } = value

        let { print, search } = req.query
        search = search ? search.trim() : ""

        if (print) {
            let name = `${bulan}_${tahun}_${new Date().getTime()}.keps`
            let data = await getJurnalUmumByBulanService(bulan, tahun, sorting, search, req.identity)
            data = data.concat(data, data, data, data, data)

            LOGGER(logType.INFO, "JURNAL LENGTH " + data.length, null, req.identity)

            encryptFile(`keps_backup/jurnal_${name}`, JSON.stringify(data), getEnv("ENCRYPT_KEY"))

            const loggerData = await getLoggerData(bulan, tahun)

            LOGGER(logType.INFO, "LOGGER LENGTH " + loggerData.length, null, req.identity)

            encryptFile(`keps_backup/logger_${name}`, JSON.stringify(loggerData), getEnv("ENCRYPT_KEY"))

            return res.json({
                message: `${name} CREATED`
            })
        }

        res.json({
            data: await getJurnalUmumByBulanService(bulan, tahun, sorting, search, req.identity),
            message: "Get Data By Bulan and Type Sorting Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const postCreateJurnalUmum = async (req, res) => {
    LOGGER(logType.INFO, "Start createJurnalUmumController", null, req.identity)
    try {
        let jurnalUmumData = req.body
        const { error, value } = jurnalUmumValidation(jurnalUmumData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jurnalUmum = await createJurnalUmumService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jurnalUmum, req.identity)
        res.json({
            data: jurnalUmum,
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

export const deleteJurnalUmumByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJurnalUmumByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJurnalUmumByUuidService(uuid, req.identity)
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

export const deleteJurnalUmumByBuktiTransaksi = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJurnalUmumByBuktiTransaksiController", null, req.identity)
    try {
        const { bukti_transaksi } = req.body
        await deleteJurnalUmumByBuktiTransaksiService(bukti_transaksi, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { bukti_transaksi }, req.identity)
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

export const updateJurnalUmumByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJurnalUmumByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await updateJurnalUmumByUuidService(uuid, req.body, req.identity, req.originalUrl, req.method)
        res.status(200).json({
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

export const backupJurnalByBulanAndTahun = async (req, res) => {
    LOGGER(logType.INFO, "Start backupJurnalByBulanAndTahun", null, req.identity)
    try {
        const { bulan, tahun } = req.params
        await updateJurnalUmumByUuidService(uuid, req.body, req.identity, req.originalUrl, req.method)
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