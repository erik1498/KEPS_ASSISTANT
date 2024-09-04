import { customerValidation } from "./customer.validation.js"
import { createCustomerService, deleteCustomerByUuidService, getAllCustomerService, getCustomerByUuidService, updateCustomerByUuidService } from "./customer.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllCustomers = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllCustomerController", null, req.identity)
    try {
        const customers = await getAllCustomerService(req.query, req.identity)
        res.json({
            data: customers,
            message: "Get Data Success"
        })
    } catch (error) {    
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const getCustomerByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getCustomerByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getCustomerByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const postCreateCustomer = async (req, res) => {
    LOGGER(logType.INFO, "Start createCustomerController", null, req.identity)
    try {
        const customerData = req.body
        const { error, value } = customerValidation(customerData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const customer = await createCustomerService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, customer, req.identity)
        res.json({
            data: customer,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const deleteCustomerByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteCustomerByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteCustomerByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const updateCustomerByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateCustomerByUuidController", null, req.identity)
    try {    
        const customerData = req.body
        const { error, value } = customerValidation(customerData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateCustomerByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}