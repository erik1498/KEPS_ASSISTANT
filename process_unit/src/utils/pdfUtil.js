import pdf from "pdf-creator-node";
import fs from "fs"
import util from "util"
import Mustache from "mustache"
import { LOGGER, logType } from "./loggerUtil.js";
import puppeteer from "puppeteer";
import { generateBase64FromPath } from "./base64Util.js";

const PROJECT_PATH = process.cwd()
export const SLIP_GAJI_PATH = PROJECT_PATH + "/template/slipGaji.html"
export const JURNAL_UMUM_PATH = PROJECT_PATH + "/template/jurnalUmum.html"
export const LABA_RUGI_PATH = PROJECT_PATH + "/template/labaRugi.html"
export const NERACA_SALDO_PATH = PROJECT_PATH + "/template/neracaSaldo.html"
export const NERACA_PATH = PROJECT_PATH + "/template/neraca.html"

const readFile = util.promisify(fs.readFile);

function getStuff(templatePath) {
    return readFile(templatePath, "utf-8");
}

export const generatePDF = async (templatePath, data, res, req_identity) => {
    LOGGER(logType.INFO, `generatePDF ${templatePath}`, data, req_identity)
    try {   
        const templateData = await getStuff(templatePath)
        data.logo = generateBase64FromPath(process.cwd() + "/template/logo.png", "image/png")
        // return pdfCreatorNode(templatePath, data, res)
        const responseHTML = Mustache.render(templateData, data)
        return makeFilePDF(responseHTML, res)
    } catch (error) {
        LOGGER(logType.ERROR, "Error generatePDF Response", error)
        throw Error("Error generatePDF Response")
    }
}

const makeFilePDF = async (fileString, res) => {
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();
    await page.setContent(fileString);
    const pdfBuffer = await page.pdf();

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=SLIP_GAJI.pdf');
    return res.send(pdfBuffer);
}

const pdfCreatorNode = async (templatePath, data, res) => {
    try {
        let params = {
            pathFile: process.cwd() + "/file-output",
            fileName:"output.pdf",
            fullPath: process.cwd() + "/file-output/output.pdf"
        }
        let templateData = await getStuff(templatePath)
        let options = {
            format: "A4",
            orientation:"potrait",
            border:"10mm",
            header: {
                height: "5mm",
                contents: `<div style="text-align:center;">Author : KEPS CONSULT</div>`
            },
            footer: {
                height: "5mm",
                contents: {
                    first: "Cover Page",
                    2: "Second Page",
                    default: `<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>`,
                    last: "Last Page"
                }
            }
        }
        let document = {
            html: templateData,
            data: data,
            path: params.fullPath,
            type: ""
        }

        let process = await pdf.create(document, options)
        if (process) {
            res.download(params.fullPath, params.fileName, (error) => {
                if (error) {
                    LOGGER(logType.ERROR, "Error generatePDF Response", error)
                    throw Error("Error generatePDF Response")
                }else{
                    fs.unlinkSync(params.fullPath)
                }
            })
        }
    } catch (error) {
        LOGGER(logType.ERROR, "Error generatePDF Response", error)
        throw Error("Error generatePDF Response")
    }
}