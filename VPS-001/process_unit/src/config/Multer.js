import multer from "multer";

export const uploads = multer({
    dest: "upload"
})