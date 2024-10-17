import Joi from "joi"

export const rincianPelunasanPembelianBarangValidation = (payload) => {
    const schema = Joi.object({
        pelunasan_pembelian_barang: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        rincian_pesanan_pembelian_barang: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        sudah_dibayar: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        piutang: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        nilai_pelunasan: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        nilai_pelunasan_denda: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
    })

    return schema.validate(payload)
}