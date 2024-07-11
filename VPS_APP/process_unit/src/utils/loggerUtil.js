import pino from "pino";
import moment from "moment"
import { createLoggerService } from "../app/logger/logger.services.js";
import { createStream } from 'rotating-file-stream';


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
    }, req_identity)
}

export const LOGGER = (logType, message, object, req_identity, req_original_url, req_method, error_monitor) => {
    const logger_message = {
        message: message,
        object: object,
        request_detail: req_identity ? JSON.parse(req_identity) : null
    }

    message = JSON.stringify(logger_message, null, 4);

    if (logType == "info") {
        pinoLogFileConfig.info(message)
        pinoLogTerminalConfig.info(message)
    }
    if (logType == "error") {
        pinoLogFileConfig.error(message)
        pinoLogTerminalConfig.error(message)
        if (error_monitor) {
            LOGGER_MONITOR(req_original_url, req_method, object, req_identity, true)
        }
    }
    if (logType == "debug") {
        pinoLogFileConfig.debug(message)
        pinoLogTerminalConfig.debug(message)
    }
}

const getDate = () => {
    let date_ob = new Date();
    return `${(date_ob.getDate() < 10 ? "0" + date_ob.getDate() : date_ob.getDate()) + "-" + ((date_ob.getMonth() + 1) < 10 ? "0" + (date_ob.getMonth() + 1) : (date_ob.getMonth() + 1)) + "-" + date_ob.getFullYear()}`;
}

const logDirectory = './log'; // Definisikan direktori log

// // Buat stream untuk log rotation
const rotatingStream = createStream((time, index) => {
    if (!time) return `${getDate()}.log`;
    return `${getDate()}-${index}.log`;
}, {
    size: '10MB', // Rotate log files when they reach 10MB
    path: logDirectory,
    compress: 'gzip', // Mengompres file log yang dirotasi
    maxFiles: 5 // Keep a maximum of 5 log files
});

export const pinoLogFileConfig = pino(
    {
        level: "debug",
        timestamp: () => `, "time":"${moment().format()}"`,
    },
    rotatingStream
)


export const pinoLogTerminalConfig = pino(
    {
        level: "debug",
        timestamp: () => `, "time":"${moment().format()}"`,
        transport: {
            targets: [
                {
                    target: "pino-pretty"
                }
            ]
        },
    },
)