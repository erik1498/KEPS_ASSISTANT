import express from "express"
import { getAllPerubahanModals } from "./perubahanModal.handler.js"
import { authTokenMiddleware } from "../../middleware/auth.js"

const router = express.Router()

router.get("/:tahun", authTokenMiddleware(), getAllPerubahanModals)

export const getPerubahanModalRoute = () => {
    return {
        controller: router,
        prefix: "/perubahan_modal"
    }
}