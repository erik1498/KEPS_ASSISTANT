import pino from "pino";
import moment from "moment"
import { createStream } from "rotating-file-stream"
import path from 'path'
import { fileURLToPath } from 'url'
import { createLoggerService } from "../app/logger/logger.services.js";

export const logType = {
    INFO: "info",
    ERROR: "error",
    DEBUG: "debug"
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        pinoLogTerminalConfig.info(message)
        pinoLogFileConfig.info(message)
    }
    if (logType == "error") {
        pinoLogTerminalConfig.error(message)
        pinoLogFileConfig.error(message)
        if (error_monitor) {
            LOGGER_MONITOR(req_original_url, req_method, object, req_identity, true)
        }
    }
    if (logType == "debug") {
        pinoLogTerminalConfig.debug(message)
        pinoLogFileConfig.debug(message)
    }
}

// Fungsi untuk membuat nama file log baru
function generator(time, index) {
    if (!time) {
        time = new Date();
        index = "Start";
    };
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hour = String(time.getHours()).padStart(2, '0');
    const minute = String(time.getMinutes()).padStart(2, '0');
    const second = String(time.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}-${hour}-${minute}-${second}-${index}.log`;
}

// Konfigurasi stream untuk rotasi file berdasarkan ukuran
const stream = createStream(generator, {
    size: '20M', // Ukuran maksimum file log sebelum dirotasi (misalnya 10MB)
    interval: '1d', // Durasi rotasi (misalnya 1 hari)
    path: path.join(__dirname, 'log')
});

export const pinoLogFileConfig = pino({
    level: "debug",
}, stream);

export const pinoLogTerminalConfig = pino(
    {
        level: "debug",
        timestamp: () => `, "time":"${moment().format()}"`,
        transport: {
            targets: [
                {
                    target: "pino-pretty"
                },
            ]
        },
    },
)