import express from "express"
import { createInstallerKeyController, createKeyGenController, getCURLCommnandController } from "./install.handler.js"

const router = express.Router()

router.post("/", createInstallerKeyController)
router.post("/keygen", createKeyGenController)
router.get("/curl", getCURLCommnandController)

export const getInstallRoute = () => {
    return {
        controller: router,
        prefix: "/install"
    }
}