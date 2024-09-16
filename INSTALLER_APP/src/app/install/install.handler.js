import { generateInstallerKey, generateKeyGen } from "./install.services.js"

export const createInstallerKeyController = async (req, res) => {
    try {
        const data = {
            serial_key: req.body[1],
            license_path: req.body[2],
            home_url: req.body[3],
            username: req.body[4],
            password: req.body[5],
            name: req.body[6],
            client_id: req.body[7],
            mac_address: req.body[8],
            os_info: req.body[9]
        }

        let response = await generateInstallerKey(data)
        return res.json({
            data: response,
            message: "Get Data Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const createKeyGenController = async (req, res) => {
    try {
        let response = await generateKeyGen(req.body)
        return res.json({
            data: response,
            message: "Get Data Success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getCURLCommnandController = async (req, res) => {
    try {
        return res.send(`
            curl -X POST http://IP_INSTALLER_LAPTOP:2000/install/keygen -H "Content-Type: application/json" -d '{
                "hostname": "http://IP_INSTALLER_LAPTOP:2000/install/",
                "serial_key": "Z6A7G-RS78E-VI2DZ-4HNF1-YYX1Q",
                "license_path": "./Ubuntu.cfgs",
                "home_url": "DOMAIN_KEPS_ASSISTANT_CLIENT",
                "username": "",
                "password": "",
                "name": "",
                "client_id":""
            }'
        `)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}