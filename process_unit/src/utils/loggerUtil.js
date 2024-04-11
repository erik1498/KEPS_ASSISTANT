import pino from "pino";
import moment from "moment"
import { createLoggerService } from "../app/logger/logger.services.js";

export const logType = {
    INFO: "info",
    ERROR: "error",
    DEBUG: "debug"
}

export const LOGGER_MONITOR = async (service, method, data, req_identity, error) => {
    const date = new Date()
    await createLoggerService({
        service,
        status: error ? "ERROR" : "SUCCESS",
        method,
        data,
        req_time: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`,
        req_identity: JSON.parse(req_identity)
    })
}

export const LOGGER = (logType, message, object, req_identity, req_original_url, req_method, error_monitor) => {
    message = "[ ID:" + req_identity + " ] = " + message
    message = object ? message + " [ " + JSON.stringify(object, null, 4) + " ]" : message

    if (logType == "info") {
        pinoLogConfig.info(message)
    }
    if (logType == "error") {
        pinoLogConfig.error(message)
        if (error_monitor) { LOGGER_MONITOR(req_original_url, req_method, object, req_identity, true) }
    }
    if (logType == "debug") {
        pinoLogConfig.debug(message)
    }
}
let date_ob = new Date();

export const pinoLogConfig = pino(
    {
        timestamp: () => `, "time":"${moment().format()}"`,
        transport: {
            targets: [
                {
                    target: "pino-pretty"
                },
                // {
                //     // target:"pino/file",
                //     target:"pino-pretty",
                //     options: {
                //         destination: `./log/${(date_ob.getDate() < 10 ? "0" + date_ob.getDate() : date_ob.getDate()) + "" + ((date_ob.getMonth() + 1) < 10 ? "0" + (date_ob.getMonth() + 1) : (date_ob.getMonth() + 1)) + "" + date_ob.getFullYear()}.pinoLogConfig`,
                //         mkdir:true,
                //     }
                // }
            ]
        },
    },
)