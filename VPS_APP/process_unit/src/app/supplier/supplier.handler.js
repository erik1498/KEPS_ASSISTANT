import { supplierValidation } from "./supplier.validation.js"
import { createSupplierService, deleteSupplierByUuidService, getAllSupplierService, getSupplierByUuidService, updateSupplierByUuidService } from "./supplier.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllSuppliers = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllSupplierController", null, req.identity)
    try {
        const suppliers = await getAllSupplierService(req.query, req.identity)
        res.json({
            data: suppliers,
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

export const getSupplierByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getSupplierByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getSupplierByUuidService(uuid, req.identity),
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

export const postCreateSupplier = async (req, res) => {
    LOGGER(logType.INFO, "Start createSupplierController", null, req.identity)
    try {
        const supplierData = req.body
        const { error, value } = supplierValidation(supplierData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const supplier = await createSupplierService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, supplier, req.identity)
        res.json({
            data: supplier,
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

export const deleteSupplierByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteSupplierByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteSupplierByUuidService(uuid, req.identity)
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

export const updateSupplierByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateSupplierByUuidController", null, req.identity)
    try {    
        const supplierData = req.body
        const { error, value } = supplierValidation(supplierData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateSupplierByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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