import express from "express"
import { deleteCustomerByUUID, getAllCustomers, getCustomerByUUID, postCreateCustomer, updateCustomerByUUID } from "./customer.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllCustomers)
router.get("/:uuid", authTokenMiddleware(), getCustomerByUUID)
router.post("/", authTokenMiddleware(), postCreateCustomer)
router.put("/:uuid", authTokenMiddleware(), updateCustomerByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteCustomerByUUID)

export const getCustomerRoute = () => {
    return {
        controller: router,
        prefix: "/customer"
    }
}