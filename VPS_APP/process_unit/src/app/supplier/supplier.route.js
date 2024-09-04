import express from "express"
import { deleteSupplierByUUID, getAllSuppliers, getSupplierByUUID, postCreateSupplier, updateSupplierByUUID } from "./supplier.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/", authTokenMiddleware(), getAllSuppliers)
router.get("/:uuid", authTokenMiddleware(), getSupplierByUUID)
router.post("/", authTokenMiddleware(), postCreateSupplier)
router.put("/:uuid", authTokenMiddleware(), updateSupplierByUUID)
router.delete("/:uuid", authTokenMiddleware(), deleteSupplierByUUID)

export const getSupplierRoute = () => {
    return {
        controller: router,
        prefix: "/supplier"
    }
}